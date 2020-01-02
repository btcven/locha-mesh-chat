//
//  LocalNotification.swift
//  LochaMeshChat
//
//  Created by Kevin Velasco on 1/2/20.
//  Copyright © 2020 Facebook. All rights reserved.
//

import Foundation
import UserNotifications


@objc(LocalNotification)
class LocalNoticication: NSObject {
  
  @objc
  func requestPermission() {
    if #available(iOS 10.0, *) {

        UNUserNotificationCenter.current().requestAuthorization(options:[.badge, .alert, .sound]) { (granted, error) in

            if granted {
               print("hello \(granted)")
            }

        }

    } else {
      print("not foundÏ")
    }
  }
    
  
  @objc
  func createNotification() {
    print("hello word")
  }
  
  @objc
  func clearNotificationID() {
    print("hello word")
  }

  @objc
  func clearNotificationAll() {
    print("hello word")
  }

  
  
  
  
}
