//
//  RNDeviceInfo.m
//  LochaMeshChat
//
//  Created by Kevin Velasco on 12/13/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import "React/RCTBridgeModule.h"

@interface RCT_EXTERN_MODULE(RNDeviceInfo, NSObject)
RCT_EXTERN_METHOD(machineName)


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}
@end
