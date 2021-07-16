//
//  RCAXMLHttpRequest.h
//  Cordova Plugin CORS
//
//  Created by Raphaël Calabro on 12/06/2017.
//
//

#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>
#import <Cordova/CDVPlugin.h>

@interface RCAXMLHttpRequest : CDVPlugin

- (void)pluginInitialize;
- (void)send:(nonnull CDVInvokedUrlCommand *)command;
    
@end
