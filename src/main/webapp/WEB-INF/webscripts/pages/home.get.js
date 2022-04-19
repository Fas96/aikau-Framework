model.jsonModel = {
   services: [
      {
         name: "alfresco/services/LoggingService",
         config: {
           loggingPreferences: {
             enabled: true,
             all: true
           }
         }
       },
      "alfresco/services/NavigationService",
      "alfresco/services/LogoutService",
      "alfresco/services/DocumentService",
      "alfresco/services/ActionService",
      "alfresco/services/DialogService",
      "alfresco/services/PreferenceService"
      // Add more services here !!!
   ],
   widgets: [
      {
         id: "MAIN_VERTICAL_LAYOUT",
         name: "alfresco/layout/VerticalWidgets",
         config: 
         {
            widgets: [
               {
                  name: "tutorial/Label"
                }, 
                {
                  name: "tutorial/Label",
                  config: {
                    label: "Good Morning",
                    additionalCssClasses: "bold"
                  }
                },
                {
                  name: "tutorial/Label",
                  config: {
                    additionalCssClasses: "large",
                    widgets: [
                      {
                        name: "alfresco/html/Label",
                        config: {
                          label: "<< {label} >>",
                          additionalCssClasses: "bold {additionalCssClasses}"
                        }
                      }
                    ]
                  }
                }, 
               // COMPOSITE WIDGET ADDED HERE...
               {
                  name: "tutorial/Header"
               },
               // THIS IS THE REST OF THE ORIGINAL JSON MODEL...
               {
                  id: "HEADER_TITLE_BAR",
                  name: "alfresco/layout/LeftAndRight",
                  className: "share-header-title",
                  config:
                  {
                     semanticWrapper: "header",
                     widgets:
                     [
                        {
                           id: "HEADER_LOGO",
                           name: "alfresco/logo/Logo",
                           align: "left",
                           config:
                           {
                              logoClasses: "alfresco-logo-only"
                           }
                        },
                        {
                           id: "HEADER_TITLE",
                           name: "alfresco/header/Title",
                           align: "left",
                           config: {
                              label: "Welcome to Aikau Development!",
                              setBrowserTitle: "Home"
                           }
                        }
                     ]
                  }
               },
               {
                 name: "tutorial/HelloWorld"
               }, 
               {
                 name: "alfresco/buttons/AlfButton",
                 config: {
                   label: "Go to parent folder",
                   iconClass: "alf-folder-up-icon",
                   publishTopic: "ALF_DOCLIST_PARENT_NAV"
                 }
               },
               {
                 name: "alfresco/documentlibrary/AlfDocumentList",
                 config: {
                   rootNode: "alfresco://user/home",
                   rawData: true,
                   widgets: [
                     {
                       name: "alfresco/documentlibrary/views/AlfSimpleView"
                     }
                   ]
                 }
               }
               
               // {
               //    //the subscription log gives us details of how all widge
               //    name: "alfresco/logging/SubscriptionLog"
               //  }
               // Add more widgets here !!!
            ]
         }
      }
   ]
};