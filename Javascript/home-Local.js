/*window.addEventListener('DOMContentLoaded', (event) => {
  createInnerHTML();
});
const createInnerHTML = () => {
  const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th>" +
                      "<th>Salary</th><th>Start Date</th><th>Actions</th>";
  let innerHtml = `${headerHtml}`;
  let emplist = empJSON();
  for (const emp of emplist)
  {
   innerHtml = `${innerHtml}
      <tr>
      <td><img class="profile" alt=""
          src="${emp._profilePic}">
      </td>
      <td>${emp._name}</td>
      <td>${emp._gender}</td>
      <td><div class="dept-label">${emp._department}</div></td>
      <td>${emp._salary}</td>
      <td>${emp._startDate}</td>
      <td>
          <img id="1" onclick="remove(this)" alt="delete"
              src="Images/delete.svg">
          <img id="1" onclick="update(this)" alt="edit"
              src="Images/create.svg">
      </td>
      </tr>
      `;
  }
  document.querySelector('#table-display').innerHTML = innerHtml;
}
const empJSON = () => {
  let empPayrollList = [
      {
          _name: 'Suraj Dal',
          _gender: 'male',
          _department: 'Engineering',
          _salary: '400000',
          _startDate: '10 May 2022',
          _note: '',
          _id: new Date().getTime(),
          _profilePic: '../Images/Ellipse -2.png'
      },
      {
          _name: 'Sanket Dal',
          _gender: 'male',
          _department: 'Engineering',
          _salary: '400000',
          _startDate: '29 March 2022',
          _note: '',
          _id: new Date().getTime() + 1,
          _profilePic: '../Images/Ellipse -3.png'
      }
  ];
  return empPayrollList;
}*/
let empPayrollList;
window.addEventListener('DOMContentLoaded', (event) => {
  if (SiteProperties.use_local_storage.match("true"))
  {
    getEmployeeData();
  }
  else
  {
    getDataFromServer();
  }
});

const getEmployeeData = () => {
  empPayrollList = localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
  processEmployeePayrollDataResponse();
}
const processEmployeePayrollDataResponse = () =>{
  document.querySelector(".emp-count").textContent = empPayrollList.length;
  createInnerHTML();
  localStorage.removeItem('editEmp');
}

const getEmployeeDateFromServer =() =>{
  makeServiceCall("GET", SiteProperties.server_url, true)
      .then(responseText =>{
          empPayrollList = JSON.parse(responseText);
          processEmployeePayrollDataResponse();
      })
      .catch(error => {
          console.log("Get Error Status: " + JSON.stringify(error));
          empPayrollList = [];
          processEmployeePayrollDataResponse();
      });
}

const createInnerHTML = () => {
    const headerHtml = "<th></th><th>Name</th><th>Gender</th><th>Department</th>"+
                     "<th>Salary</th><th>Start Date</th><th>Actions</th>";
    if (empPayrollList.length == 0) return;
    let innerHtml = `${headerHtml}`;
    for (const empPayrollData of empPayrollList) {
      innerHtml = `${innerHtml}
      <tr>
        <td><img class="profile" alt="" 
                  src="${empPayrollData._profilePic}">
        </td>
        <td>${empPayrollData._name}</td>
        <td>${empPayrollData._gender}</td>
        <td>${getDeptHtml(empPayrollData._department)}</td>
        <td>${empPayrollData._salary}</td>
        <td>${stringifyDate(empPayrollData._startDate)}</td>
        <td>
          <img id="${empPayrollData.id}" onclick="remove(this)" 
             src="../Images/delete.svg" alt="delete">
          <img id="${empPayrollData.id}" onclick="update(this)" 
             src="../Images/create.svg" alt="edit">
        </td>
      </tr>
      `;
    }
    document.querySelector("#table-display").innerHTML = innerHtml;
}

const getDeptHtml = (deptList) => {
    let deptHtml = '';
    for (const dept of deptList) {
        deptHtml = `${deptHtml} <div class='dept-label'>${dept}</div>`
    }
    return deptHtml;
  }