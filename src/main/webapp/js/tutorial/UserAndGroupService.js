define(["dojo/_base/declare","alfresco/core/Core","dojo/_base/lang","alfresco/core/CoreXhr","service/constants/Default"],
        function(declare, Core, lang, CoreXhr, AlfConstants) {
   
  return declare([Core,CoreXhr], {
      
    constructor: function tutorial_UserAndGroupService__constructor(args) {
      lang.mixin(this, args);
      this.alfSubscribe("TUTORIAL_CREATE_GROUP", lang.hitch(this, this.createGroup));

      this.alfSubscribe("TUTORIAL_ADD_USER_TO_GROUP", lang.hitch(this, this.addUserToGroup));
    },

    addUserToGroup: function tutorial_UserAndGroupService__addUserToGroup(payload) {
        this.serviceXhr({
          url: AlfConstants.PROXY_URI + "api/groups/" + payload.groupId + "/children/" + payload.userName,
          method: "POST",
          data: {
            pubSubScope: payload.pubSubScope
         },
         onSuccess:  function tutorial_UserAndGroupService__onSuccess(response, originalRequestConfig) {
            var pubSubScope = lang.getObject("data.pubSubScope", false, originalRequestConfig);
            if (pubSubScope == null)
            {
               pubSubScope = "";
            }
            this.alfPublish(pubSubScope + "ALF_DOCLIST_RELOAD_DATA");
         },
          callbackScope: this
        });
      },
      
    createGroup: function tutorial_UserAndGroupService__createGroup(payload) {
        this.serviceXhr({
            url: AlfConstants.PROXY_URI + "api/rootgroups/" + payload.groupId,
            method: "POST",
            data: {
              displayName: payload.displayName
            },
            successCallback: this.onSuccess,
            callbackScope: this
     });
    
    }
  });
});