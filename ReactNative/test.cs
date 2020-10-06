namespace Extwebhooks.Api.Controllers.Internal
{
    using System;
    using System.ComponentModel;
    using System.ComponentModel.DataAnnotations;
    using System.Net;
    using System.Threading.Tasks;
    using Extwebhooks.Api.Requests;
    using Extwebhooks.Core.Data;
    using Extwebhooks.Core.Extensions;
    using Extwebhooks.Core.ExternalModel;
    using Extwebhooks.Core.Validation;
    using Microsoft.AspNetCore.Mvc;
    using Trustpilot.ApiAuthorizationMiddleware.Authorization;
    using Trustpilot.ApiAuthorizationMiddleware.Authorization.Attributes;
    using Trustpilot.ApiAuthorizationMiddleware.Documentation;
    using Trustpilot.ApiInfrastructure.AspNetCore.Extensions;
    using Trustpilot.ApiModelInfrastructure.Attributes;
    using Trustpilot.ApiModelInfrastructure.ErrorHandling;

    [Description("Internal Webhooks API")]
    public class SetSubscriptionController : Controller
    {
        private readonly IExternalWebhooksConfigurationRepository repository;

        public SetSubscriptionController(
            IExternalWebhooksConfigurationRepository repository)
        {
            this.repository = repository;
        }

        [HttpPost("v1/internal/external-webhooks/{businessUnitId}/subscriptions", Name = "Set subscriptions for business unit (internal)")]
        [ProducesResponseType(typeof(void), (int)HttpStatusCode.NoContent)]
        [ProducesErrorResponse((int)HttpStatusCode.BadRequest, "If the event contains malformed data")]
        [ProducesErrorResponse((int)HttpStatusCode.Forbidden)]
        [ProducesErrorResponse((int)HttpStatusCode.Unauthorized)]
        [Description("Set partner subscriptions for business unit")]
        [SystemAuthorization]
        [RequiresOAuth(AuthorizationPolicy = AuthorizationPolicies.System)]
        public async Task<IActionResult> SetPartnersSubscriptions(
            [Description("The business unit id")] [Required] string businessUnitId,
            [FromBody] SetSubscriptionsRequest request)
        {
            var internalEventName = EventNameMapper.MapExternalToInternal(request.EventName);
            if (string.IsNullOrEmpty(internalEventName))
            {
                return this.Error($"Event [{request.EventName}] not recognized/supported.", GeneralError.RequestMalformed);
            }

            foreach (var sub in request.UrlSubscriptions)
            {
                if (!Uri.IsWellFormedUriString(sub.Url, UriKind.Absolute))
                {
                    return this.Error($"[{sub.Url}] is not a valid url.", WebhooksError.UrlInvalid);
                }
                else if(!UrlValidationHelper.IsPublicAddress(sub.Url))
                {
                    return this.Error($"[{sub.Url}] is not a publicly accessible url.", WebhooksError.UrlNotPublic);
                }
            }

            var businessUnitConfiguration = await repository.FindAsync(businessUnitId) ??
                                            new ExternalWebhooksConfiguration(businessUnitId);

            businessUnitConfiguration.Subscriptions.RemoveAll(x => x.EventType == internalEventName);

            request.UrlSubscriptions.ForEach(x =>
                businessUnitConfiguration.Subscriptions.Add(new Subscription(internalEventName, x.Url, x.Enabled)));

            await repository.SaveAsync(businessUnitConfiguration);

            return NoContent();
        }
    }
}