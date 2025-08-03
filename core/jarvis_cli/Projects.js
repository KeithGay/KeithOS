/////////////////////////////
// Projects.gs
// CRUD functions for: Projects_Tracker
/////////////////////////////

/*
📌 FIELD GUIDE — Projects_Tracker
---------------------------------------
Sheet Name: "Projects_Tracker"

Expected Headers:
- Project ID
- Project Name
- System Type
- Related Apps
- Custom Ruleset
- SaveState Tab
- Status
- Notes

Sample Object:
{
  "Project ID": "PRJ-001",
  "Project Name": "Clear Path",
  "System Type": "XP App",
  "Related Apps": "Mailer XP, Brand XP",
  "Custom Ruleset": "None",
  "SaveState Tab": "SaveState_ClearPath",
  "Status": "✅ Active",
  "Notes": "Stress-free job search experience"
}
*/

/**
 * Adds a new project to the Projects_Tracker sheet.
 * Auto-generates Project ID if missing.
 * @param {Object} projectData
 */
function addProject(projectData) {
  var sheetName = "Projects_Tracker";
  var sheet = getSheetByName_(sheetName);
  var headerMap = getHeaderMap(sheetName);

  if (!projectData["Project ID"]) {
    projectData["Project ID"] = getNextAvailableId("PRJ", sheetName, "Project ID");
  }

  if (!isIdAvailable(sheetName, "Project ID", projectData["Project ID"])) {
    throw new Error("❌ Project ID already exists: " + projectData["Project ID"]);
  }

  var row = new Array(Object.keys(headerMap).length).fill("");

  for (var key in projectData) {
    if (headerMap.hasOwnProperty(key)) {
      row[headerMap[key]] = projectData[key];
    }
  }

  sheet.appendRow(row);
}


/**
 * Retrieves a project by its Project ID.
 * @param {string} projectId
 * @returns {Object|null}
 */
function getProjectById(projectId) {
  var sheet = getSheetByName_("Projects_Tracker");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === projectId) {
      var row = data[i];
      var project = {};
      headers.forEach(function(header, index) {
        project[header] = row[index];
      });
      return project;
    }
  }

  return null;
}


/**
 * Updates a project by its Project ID.
 * @param {string} projectId
 * @param {Object} updatedData
 * @returns {boolean}
 */
function updateProjectById(projectId, updatedData) {
  var sheet = getSheetByName_("Projects_Tracker");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var headerMap = getHeaderMap("Projects_Tracker");

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === projectId) {
      for (var key in updatedData) {
        if (headerMap.hasOwnProperty(key)) {
          var col = headerMap[key] + 1;
          sheet.getRange(i + 1, col).setValue(updatedData[key]);
        }
      }
      return true;
    }
  }

  return false;
}


/**
 * Deletes a project by its Project ID.
 * @param {string} projectId
 * @returns {boolean}
 */
function deleteProjectById(projectId) {
  var sheetName = "Projects_Tracker";
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headerMap = getHeaderMap(sheetName);
  var idIndex = headerMap["Project ID"];

  if (idIndex === undefined) {
    throw new Error('❌ "Project ID" column not found in header map.');
  }

  for (var i = 1; i < data.length; i++) {
    if (data[i][idIndex] === projectId) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}


/**
 * Lists all projects in the tracker.
 * @returns {Array<Object>}
 */
function listAllProjects() {
  var sheet = getSheetByName_("Projects_Tracker");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var projects = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var project = {};
    headers.forEach(function(header, index) {
      project[header] = row[index];
    });
    projects.push(project);
  }

  return projects;
}


/*** TEST ONLY START ***/

// function testAddProjectAuto() {
//   addProject({
//     "Project Name": "Test Auto Project",
//     "System Type": "XP App",
//     "Related Apps": "None",
//     "Custom Ruleset": "None",
//     "SaveState Tab": "SaveState_TestAuto",
//     "Status": "Planned",
//     "Notes": "Auto-ID test"
//   });
// }

// function testGetProjectById() {
//   Logger.log(getProjectById("PRJ-001"));
// }

// function testUpdateProject() {
//   updateProjectById("PRJ-001", {
//     "Status": "✅ Complete",
//     "Notes": "Final phase closed"
//   });
// }

// function testDeleteProject() {
//   var success = deleteProjectById("PRJ-001");
//   Logger.log("Deleted? → " + success);
// }

// function testListAllProjects() {
//   var allProjects = listAllProjects();
//   Logger.log(allProjects);
// }

/*** TEST ONLY END ***/
