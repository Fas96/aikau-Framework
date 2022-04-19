var options = [];
var result = remote.call("/api/people?filter=");
if (result.status.code == status.STATUS_OK)
{
   var rawData = JSON.parse(result);
   if (rawData && rawData.people)
   {
      var people = rawData.people;
      for (var i=0; i<people.length; i++)
      {
         options.push({
            value: people[i].userName,
            label: people[i].firstName + " " + people[i].lastName
         });
      }
   }
}


model.jsonModel = {
   services: [
     "alfresco/services/CrudService",
     "alfresco/services/DialogService",
     "tutorial/UserAndGroupService",
     "alfresco/services/OptionsService"
   ]
 };
 
 var list = {
   name: "alfresco/lists/AlfList",
   config: {
     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
     loadDataPublishPayload: {
       url: "api/groups?sortBy=displayName&zone=APP.DEFAULT"
     },
     itemsProperty: "data"
   }
 };


 var forViewItemsArr=[{
   name: "alfresco/forms/controls/TextBox",
   config: {
     fieldId: "ID",                        
     label: "Identifier",
     name: "groupId",
     description: "Enter a unique identifier for the group. Only alphanumeric characters are allowed",
     requirementConfig: {
       initialValue: true
     },
     validationConfig: [
       {
         validation: "regex",
         regex: "^[A-Za-z0-9]+$",
         errorMessage: "Alphanumeric characters only"
       }
     ]
   }
 },
 {
   name: "alfresco/forms/controls/TextBox",
   config: {
     fieldId: "DISPLAYNAME",
     label: "Display name",
     name: "displayName"
   }
 }];

 var formbtnView={
   name: "alfresco/buttons/AlfButton",
   config: {
     label: "Create New Group",
     publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
     publishPayload: {
       dialogTitle: "Create Group",
       dialogConfirmationButtonTitle: "Create",
       dialogCancellationButtonTitle: "Cancel",
       formSubmissionTopic: "TUTORIAL_CREATE_GROUP",
       fixedWidth: true,
       widgets: forViewItemsArr
     }
   }
 }; 


//  var formbtnView={
//    name: "alfresco/buttons/AlfButton",
//    config: {
//       label: "Display form dialog",
//       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
//       publishPayload: {
//          cancelPublishScope: "",
//          cancelPublishTopic: "DIALOG_CANCELLED",
//          dialogId: "NAME_DIALOG",
//          dialogTitle: "User name",
//          dialogConfirmationButtonTitle: "Save",
//          dialogCancellationButtonTitle: "Quit",
//          formSubmissionTopic: "MY_CUSTOM_TOPIC",
//          formSubmissionPayloadMixin: {
//             extra: "bonus data"
//          },
//          formValue: {
//             name: "Bob"
//          },
//          widgets: [
//             {
//                name: "alfresco/forms/controls/TextBox",
//                config: {
//                   name: "name",
//                   label: "Name?",
//                   description: "Please enter your name"
//                }
//             }
//          ]
//       }
//    }
// };
var AddUserSelectControl={
   name: "alfresco/forms/controls/Select",
   config: {
      label: "User",
      description: "Select a user to add to the group",
      name: "userName",
      optionsConfig: {
         fixed: options
         // publishTopic: "ALF_GET_FORM_CONTROL_OPTIONS",
         // publishPayload: {
         //   url: url.context + "/proxy/alfresco/api/people?filter=",
         //   itemsAttribute: "people",
         //   labelAttribute: "userName",
         //   valueAttribute: "userName"
         // }
      }
   }
};

var addUserToGroup={
   name: "alfresco/forms/Form",
   config: {
      okButtonLabel: "Add User",
      okButtonPublishTopic: "TUTORIAL_ADD_USER_TO_GROUP",
      okButtonPublishPayload: {
         groupId: "{shortName}",
         pubSubScope: "GROUP_USERS_"
      },
	okButtonPublishGlobal: true,
      showCancelButton: false,
      widgets: [AddUserSelectControl]
   }
};


//note on the scope of the widget Fas
var usersListView={
   name: "alfresco/lists/AlfList",
   config: {
      pubSubScope: "GROUP_USERS_",
     waitForPageWidgets: false,
     generatePubSubScope: true,  ///note
     loadDataPublishTopic: "ALF_CRUD_GET_ALL",
     loadDataPublishPayload: {
       url: "api/groups/{shortName}/children?sortBy=displayName&maxItems=50&skipCount=0"
     },
     itemsProperty: "data",
     widgets: [
       {
         name: "alfresco/documentlibrary/views/AlfDocumentListView",
         config: {
           widgets: [
             {
               name: "alfresco/lists/views/layouts/Row",
               config: {
                 widgets: [
                   {
                     name: "alfresco/lists/views/layouts/Cell",
                     config: {
                       widgets: [
                         {
                           name: "alfresco/renderers/Property",
                           config: {
                             propertyToRender: "displayName"
                           }
                         }
                       ]
                     }
                   }
                 ]
               }
             }
           ]
         }
       }
     ]
   }
 };
 
 var views = [
   {
     name: "alfresco/documentlibrary/views/AlfDocumentListView",
       config: {
       widgets: [
         {
           id: "VIEW_ROW",
           name: "alfresco/documentlibrary/views/layouts/Row",
           config: {
             widgets: [
               {
                 name: "alfresco/documentlibrary/views/layouts/Cell",
                 config: {
                 widgets: [
                   {
                     id: "DATA_LIST_TITLE",
                     name: "alfresco/renderers/PropertyLink",
                     config: {
                       propertyToRender: "displayName",
                       useCurrentItemAsPayload: false,
                       publishTopic: "ALF_CREATE_DIALOG_REQUEST",
                       publishPayloadType: "PROCESS",
                       publishPayloadModifiers: ["processCurrentItemTokens"],
                       publishPayload: {
                        dialogTitle: "{displayName}",
                        fixedWidth: true,
                        widgetsContent: [addUserToGroup,usersListView]
                      }
                     }
                   }
                 ]
               }
             }
           ]
         }
       }
     ]
   }
 }];
 
 list.config.widgets = views;
 model.jsonModel.widgets = [formbtnView,list];
 
// model.jsonModel = {
//    services: [
//       "alfresco/services/CrudService",
//       "alfresco/services/DialogService"
//    ],
//    widgets:[
//       {
//          name: "alfresco/lists/AlfList",
//          config: {
//             loadDataPublishTopic: "ALF_CRUD_GET_ALL",
//             loadDataPublishPayload: {
//               url: "api/groups?sortBy=displayName&zone=APP.DEFAULT"
//             },
//             itemsProperty: "data",
//             widgets: [
               
//                {
//                   name: "alfresco/buttons/AlfButton",
//                   config: {
//                     label: "Create New Group",
//                     publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
//                     publishPayload: {
//                       dialogTitle: "Create Group",
//                       dialogConfirmationButtonTitle: "Create",
//                       dialogCancellationButtonTitle: "Cancel",
//                       formSubmissionTopic: "ALF_CRUD_CREATE",
//                       fixedWidth: true,
//                       widgets: []
//                     }
//                   }
//                 },
//                {
//                        name: "alfresco/documentlibrary/views/AlfDocumentListView",
//                          config: {
//                          widgets: [
//                            {
//                              id: "VIEW_ROW",
//                              name: "alfresco/documentlibrary/views/layouts/Row",
//                              config: {
//                                widgets: [
//                                  {
//                                    name: "alfresco/documentlibrary/views/layouts/Cell",
//                                    config: {
//                                    widgets: [
//                                      {
//                                        id: "DATA_LIST_TITLE",
//                                        name: "alfresco/renderers/Property",
//                                        config: {
//                                          propertyToRender: "displayName"
//                                        }
//                                      }
//                                    ]
//                                  }
//                                }
//                              ]
//                            }
//                          }
//                        ]
//                      }
//                    }
//             ]
//          }
//       }
//    ]
// };