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
class LocalNoticication: RCTEventEmitter, UNUserNotificationCenterDelegate {
  
  @objc
  func requestPermission() {
    if #available(iOS 10.0, *) {
        
        UNUserNotificationCenter.current().delegate = self
        UNUserNotificationCenter.current().requestAuthorization(options:[.badge, .alert, .sound]) { (granted, error) in

            if granted {
               print("hello \(granted)")
            }

        }

    } else {
      print("not found")
    }
  }
  
  override func supportedEvents() -> [String]! {
    return ["NoticationReceiver"]
  }
  
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter, willPresent notification: UNNotification, withCompletionHandler completionHandler: @escaping (UNNotificationPresentationOptions) -> Void) {
    completionHandler([.alert, .sound])
  }
  
  @available(iOS 10.0, *)
  func userNotificationCenter(_ center: UNUserNotificationCenter, didReceive response: UNNotificationResponse, withCompletionHandler completionHandler: @escaping () -> Void) {
    
    
    var res = [
      "id" : response.notification.request.identifier,
      "title": response.notification.request.content.title,
      "message":response.notification.request.content.body
    ]
    sendEvent(withName: "NoticationReceiver", body: res )
    completionHandler()
  }
    
  
  @objc func createNotification(_ details:NSDictionary) {
    if #available(iOS 10.0, *) {
      print("entro aqui")
      let content = UNMutableNotificationContent()
      content.title = details["title"] as! String
      content.body = details["message"] as! String
      content.sound = UNNotificationSound.default
      let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 1 , repeats: false)
      
      
//      let uuidString = UUID().uuidString
      let request = UNNotificationRequest(identifier: details["id"] as! String,
                  content: content, trigger: trigger)

      // Schedule the request with the system.
      let notificationCenter = UNUserNotificationCenter.current()
      notificationCenter.add(request) { (error) in
         if error != nil {
          print("hay un error Ï")
         }
      }
    } else {
      // Fallback on earlier versions
    }
  }
  
  @available(iOS 10.0, *)
  @objc func clearNotificationID(id:NSNumber) {
    let identificator:String = id.stringValue
    UNUserNotificationCenter.current().removeDeliveredNotifications(withIdentifiers: [identificator] )
  }

  @available(iOS 10.0, *)
  @objc func clearNotificationAll() {
    UNUserNotificationCenter.current().removeAllDeliveredNotifications()
  }
  
}
