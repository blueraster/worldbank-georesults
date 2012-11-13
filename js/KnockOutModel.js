function KOModel() {
this.currentMenu=ko.observable("StoriesContainer");
this.currentTitle=ko.observable(appDefault.get("config").homeTitle);
this.currentTitleLinks=ko.observable("");
this.currentDescription=ko.observable(appDefault.get("config").homeDescription);
this.currentDescriptionHeight=ko.observable(0);
this.currentDescriptionMinimized=ko.observable(true);
this.previousTitle=ko.observable("");
this.previousDescription=ko.observable("");

this.noProjectsMsg=ko.observable("");

this.clickedTitleProjects=ko.observable("");
this.currentTitleProjects=ko.observable(appDefault.get("config").homeTitle);
this.currentDescriptionProjects=ko.observable(appDefault.get("config").homeDescription);

this.currentTitleActivities=ko.observable("");
this.currentDescriptionActivities=ko.observable("");


this.currentTitleActivity=ko.observable("");
this.currentDescriptionActivity=ko.observable("");

this.currentCountry=ko.observable("");
this.currentInput=ko.observable("");


this.linkRootEnabled=ko.observable(true);
this.linkRootActive=ko.observable(false);
this.linkCountryEnabled=ko.observable(false);
this.linkCountryActive=ko.observable(false);
this.linkStoryEnabled=ko.observable(false);
this.linkStoryActive=ko.observable(false);
this.linkActivityEnabled=ko.observable(false);
this.linkActivityActive=ko.observable(false);

this.linkProjectValue=ko.observable("");
this.linkActivityValue=ko.observable("");

this.activityTotal = ko.observable(0);
this.activityCurrent = ko.observable(0);

this.projectGridTotal = ko.observable(0);
this.projectGridPages = ko.observable(0);
this.projectGridCurrent = ko.observable(0);

this.activityGridTotal = ko.observable(0);
this.activityGridPages = ko.observable(0);
this.activityGridCurrent = ko.observable(0);

}