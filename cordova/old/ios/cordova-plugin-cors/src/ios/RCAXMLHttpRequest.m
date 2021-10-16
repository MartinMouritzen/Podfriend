//
//  RCAXMLHttpRequest.m
//  Cordova Plugins CORS
//
//  Created by Raphaël Calabro on 12/06/2017.
//
//

#import "RCAXMLHttpRequest.h"

@interface RCAXMLHttpRequest () {
    NSOperationQueue *_queue;
    NSURLSession *_session;
}
@end

@implementation RCAXMLHttpRequest

- (void)pluginInitialize {
    _queue = [[NSOperationQueue alloc] init];
    _session = [NSURLSession sessionWithConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration] delegate:nil delegateQueue:_queue];
}

- (void)send:(CDVInvokedUrlCommand *)command {
    NSString *method = [command argumentAtIndex:0];
    NSString *path = [command argumentAtIndex:1];
    NSDictionary *headers = [command argumentAtIndex:2];
    NSObject *data = [command argumentAtIndex:3];
    NSString *responseType = [command argumentAtIndex:4];
    
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:path]];
    [request setHTTPMethod:method];
    if (![data isEqual:[NSNull null]]) {
        if ([data isKindOfClass:NSString.class]) {
            [request setHTTPBody:[(NSString *)data dataUsingEncoding:NSUTF8StringEncoding]];
        } else if ([data isKindOfClass:NSArray.class] && [@"multipart/form-data" isEqualToString:[headers objectForKey:@"Content-Type"]]) {
            NSString *boundary = [RCAXMLHttpRequest boundary];
            [headers setValue:[NSString stringWithFormat:@"multipart/form-data; charset=utf-8; boundary=%@", boundary] forKey:@"Content-Type"];
            [request setHTTPBody:[RCAXMLHttpRequest httpBodyForMultipartFormData:(NSArray <NSDictionary *> *)data withBoundary:boundary]];
        } else {
            NSLog(@"Unsupported data type: %@", data.class);
        }
    }
    [headers enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *obj, BOOL * _Nonnull stop) {
        [request setValue:obj forHTTPHeaderField:key];
    }];
    
    NSURLSessionDataTask *task = [_session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable urlResponse, NSError * _Nullable error) {
        NSNumber *statusCode = @200;
        NSString *statusText = @"OK";
        id response = [NSNull null];
        id responseText = [NSNull null];
        NSDictionary *headers = @{};
        NSString *allHeaders = @"";
        NSString *contentType = @"";

        if ([urlResponse isKindOfClass:NSHTTPURLResponse.class]) {
            NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)urlResponse;
            statusCode = [NSNumber numberWithInteger:httpResponse.statusCode];
            statusText = [RCAXMLHttpRequest statusTextForStatusCode:httpResponse.statusCode];
            contentType = [httpResponse.allHeaderFields objectForKey:@"Content-Type"];

            NSDictionary *allHeaderFields = httpResponse.allHeaderFields;
            headers = allHeaderFields;

            NSMutableArray *headerArray = [[NSMutableArray alloc] initWithCapacity:allHeaderFields.count];
            [allHeaderFields enumerateKeysAndObjectsUsingBlock:^(NSString *key, NSString *obj, BOOL * _Nonnull stop) {
                [headerArray addObject:[NSString stringWithFormat:@"%@: %@", key, obj]];
            }];
            allHeaders = [headerArray componentsJoinedByString:@"\r\n"];
        }

        if ([responseType isEqualToString:@"text"]) {
            NSStringEncoding encoding = NSASCIIStringEncoding;
            if (urlResponse.textEncodingName != nil) {
                encoding = CFStringConvertEncodingToNSStringEncoding(CFStringConvertIANACharSetNameToEncoding((CFStringRef)urlResponse.textEncodingName));
            }
            responseText = [[NSString alloc] initWithData:data encoding:encoding];
        } else if ([responseType isEqualToString:@"arraybuffer"]) {
            NSMutableArray *array = [[NSMutableArray alloc] initWithCapacity:data.length];
            const uint8_t *bytes = data.bytes;
            for (NSUInteger index = 0; index < data.length; index++) {
                [array addObject:[NSNumber numberWithInt:(int)bytes[index]]];
            }
            NSError *jsonError;
            NSData *jsonData = [NSJSONSerialization dataWithJSONObject:array options:0 error:&jsonError];
            if (jsonError == nil) {
                response = [[NSString alloc] initWithData:jsonData encoding:NSASCIIStringEncoding];
            }
        } else {
            NSLog(@"Given responseType is not supported: %@", responseType);
        }

        [self.commandDelegate sendPluginResult:
         [CDVPluginResult resultWithStatus:CDVCommandStatus_OK
                       messageAsDictionary:@{
                                             @"status": statusCode,
                                             @"statusText": statusText,
                                             @"response": response,
                                             @"responseText": responseText,
                                             @"responseHeaders": headers,
                                             @"allResponseHeaders": allHeaders
                                             }]
                                    callbackId:command.callbackId];
    }];
    [task resume];
}

+ (NSData *)httpBodyForMultipartFormData:(NSArray <NSDictionary *> *)formData withBoundary:(NSString *)boundary {
    NSData *lineEnd = [@"\r\n" dataUsingEncoding:NSASCIIStringEncoding];

    NSMutableData *body = [[NSMutableData alloc] init];
    for (NSDictionary *entry in (NSArray <NSDictionary *> *)formData) {
        NSString *key = [entry objectForKey:@"key"];
        NSString *value = [entry objectForKey:@"value"];
        NSString *type = [entry objectForKey:@"type"];
        if ([@"file" isEqualToString:type]) {
            NSData *data = [[NSData alloc] initWithBase64EncodedString:value options:0];
            [body appendData:[[NSString stringWithFormat:@"--%@\r\n"
                               "Content-Disposition: form-data; name=\"%@\"; filename=\"%@\"\r\n"
                               "Content-Type: %@\r\n"
                               "Content-Length: %lu\r\n"
                               "\r\n",
                               boundary,
                               key, [entry objectForKey:@"fileName"], [entry objectForKey:@"mimeType"],
                               (unsigned long)data.length] dataUsingEncoding:NSUTF8StringEncoding]];
            [body appendData:data];
            [body appendData:lineEnd];
        }
        else if ([@"string" isEqualToString:type]) {
            NSData *data = [value dataUsingEncoding:NSUTF8StringEncoding];
            [body appendData:[[NSString stringWithFormat:@"--%@\r\n"
                               "Content-Disposition: form-data; name=\"%@\"\r\n"
                               "Content-Type: text/plain; charset=utf-8\r\n"
                               "Content-Length: %lu\r\n"
                               "\r\n",
                               boundary,
                               key,
                               (unsigned long)data.length] dataUsingEncoding:NSUTF8StringEncoding]];
            [body appendData:data];
            [body appendData:lineEnd];
        }
        else {
            NSLog(@"Unsupported multipart type: %@", type);
        }
    }
    [body appendData:[[NSString stringWithFormat:@"--%@--\r\n", boundary] dataUsingEncoding:NSASCIIStringEncoding]];
    return body;
}

+ (NSString *)boundary {
    return [NSString stringWithFormat:@"rca-xhr-boundary-%ld-%u", (long)[NSDate timeIntervalSinceReferenceDate], arc4random() % 1000000];
}

+ (NSString *)statusTextForStatusCode:(NSInteger)statusCode {
    switch (statusCode) {
        case 100:
            return @"Continue";
        case 101:
            return @"Switching Protocols";
        case 200:
            return @"OK";
        case 201:
            return @"Created";
        case 202:
            return @"Accepted";
        case 203:
            return @"Non-Authoritative Information";
        case 204:
            return @"No Content";
        case 205:
            return @"Reset Content";
        case 300:
            return @"Multiple Choices";
        case 301:
            return @"Moved Permanently";
        case 400:
            return @"Bad Request";
        case 401:
            return @"Unauthorized";
        case 402:
            return @"Payment Required";
        case 403:
            return @"Forbidden";
        case 404:
            return @"Not Found";
        case 405:
            return @"Method Not Allowed";
        case 406:
            return @"Not Acceptable";
        case 407:
            return @"Proxy Authentication Required";
        case 408:
            return @"Request Timeout";
        case 500:
            return @"Internal Server Error";
        default:
            return @"Unknown status code";
    }
}

@end
