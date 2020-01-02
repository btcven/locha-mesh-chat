//
//  LocalNotification.m
//  LochaMeshChat
//
//  Created by Kevin Velasco on 1/2/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(LocalNotification, NSObject)
RCT_EXTERN_METHOD(requestPermission)
RCT_EXTERN_METHOD(createNotification)
RCT_EXTERN_METHOD(clearNotificationID)
RCT_EXTERN_METHOD(clearNotificationAll)


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}
@end

