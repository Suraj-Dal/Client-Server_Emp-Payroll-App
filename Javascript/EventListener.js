let isUpdate = false;
let employeePayrollObject = {};
window.addEventListener('DOMContentLoaded', (event) => {
    const name = document.querySelector('#name');
    const textError = document.querySelector('.name-error');
    name.addEventListener('input', function() {
        if(name.value.length == 0) {
            textError.textContent = "";
            return;
        }
        try 
        {
            checkName(name.value);
            textError.textContent = "";
        } catch (e) 
        {
            textError.textContent = e;
        }
    });
    const date = document.querySelector('#date');
    date.addEventListener('input', function(){
        let startDate = document.getElementById('day').value + document.getElementById('month').value + document.getElementById('year').value;
        try 
        {
            checkStartDate(new Date(Date.parse(startDate)));
            setTextValue('.date-error', "");
        }
        catch (e)
        {
            setTextValue('.date-error', e);
        }
    });
    checkForUpdate();
});

function save(event)
{
    //event.preventDefault();
    //event.stopPropagation();
    try{
    setEmployeePayrollObject();
    if(SiteProperties.use_local_storage.match("true")){
        createAndUpdateStorage();
        resetForm();
        window.location.replace("../Home.html");
    }
    else{
        createEmployeeJsonServer();
        resetForm();
    }
}
catch (ex)
{
    return;
}
    //let employeePayrollData = createEmployeePayroll();
    //createAndUpdateStorage(employeePayrollData);
}

function createEmployeeJsonServer()
{
    let postUrl = SiteProperties.server_url;
    let methodCall = "POST";
    if(isUpdate){
        methodCall = "PUT";
        postUrl = SiteProperties.server_url + employeePayrollObject.id.toString();
    }
    makeServiceCall(methodCall, postUrl, true, employeePayrollObject)
        .then(responseText =>{
            resetForm();
            window.location.replace(SiteProperties.HomePage);
        })
        .catch(error =>{
            throw error;
        });
}

function setEmployeePayrollObject()
{
    if(!isUpdate && SiteProperties.use_local_storage.match("true")){
        employeePayrollObject.id = createEmployeeID();
    } 
    employeePayrollObject._name = document.getElementById("name").value;
    employeePayrollObject._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollObject._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollObject._department = getSelectedValues('[name=department]');
    employeePayrollObject._salary = document.getElementById("salary").value;
    employeePayrollObject._notes = document.getElementById("notes").value;
    let date = document.getElementById("day").value + document.getElementById("month").value + document.getElementById("year").value;
    employeePayrollObject._startDate = new Date(Date.parse(date));;
}

/*function createEmployeePayroll()
{
    let employeePayrollData = new EmployeeModel();
    if(!isUpdate && SiteProperties.use_local_storage.match("true"))
    {
        employeePayrollData.id = createEmployeeID();
    }
    employeePayrollData._name = document.getElementById("name").value;
    employeePayrollData._profilePic = getSelectedValues('[name=profile]').pop();
    employeePayrollData._gender = getSelectedValues('[name=gender]').pop();
    employeePayrollData._department = getSelectedValues('[name=department]');
    employeePayrollData._salary = document.getElementById("salary").value;
    employeePayrollData._note = document.getElementById("notes").value;
    let date = document.getElementById("day").value + document.getElementById("month").value + document.getElementById("year").value;
    employeePayrollData._startDate = new Date(Date.parse(date));
    return employeePayrollData;
}*/

const getSelectedValues = (propertyValue) =>{
    let allItems = document.querySelectorAll(propertyValue);
    let selectedItems = [];
    allItems.forEach(item =>{
        if(item.checked)
        {
            selectedItems.push(item.value);
        }
    });
    return selectedItems;
}
// Saving Employee model to local storage.

function createAndUpdateStorage() 
{
    let employeePayrollList = JSON.parse(localStorage.getItem("EmployeePayrollList"));

    if(employeePayrollList)
    {
        let empPayrollData = employeePayrollList.find(empData => empData.id == employeePayrollObject.id);
        if(!empPayrollData)
        {
            employeePayrollList.push(employeePayrollObject);
        }
        else
        {
            const index = employeePayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
            employeePayrollList.splice(index, 1, employeePayrollObject);
        }
    }
    else 
    {
        employeePayrollList = [employeePayrollObject];
    }
    alert(employeePayrollList.toString());
    localStorage.setItem("EmployeePayrollList", JSON.stringify(employeePayrollList));
}

function createEmployeeID()
{
    let empID = localStorage.getItem("EmployeeID");
    empID = !empID ? 1 : (parseInt(empID)+1).toString();
    localStorage.setItem("EmployeeID", empID);
    return empID;
}

 function setForm()
{
    setValue('#name', employeePayrollObject._name);
    setSelectedValues('[name=profile]', employeePayrollObject._profilePic);
    setSelectedValues('[name=gender]', employeePayrollObject._gender);
    setSelectedValues('[name=department]', employeePayrollObject._department);
    setValue('#salary', employeePayrollObject._salary);
    setTextValue('.salary-output', employeePayrollObject._salary)
    setValue('#notes', employeePayrollObject._note);
    let date = stringifyDate(employeePayrollObject._startDate).split(" ");
    setValue('#day', date[0]);
    setValue('#month', date[1]);
    setValue('#year', date[2]);   
}

// UC5:- Ability to reset the form on clicking reset  
function resetForm() {
    setValue('#name','');
    unsetSelectedValues('[name=profile]');
    unsetSelectedValues('[name=gender]');
    unsetSelectedValues('[name=department]');
    setValue('#salary', '');
    setValue('#notes', '');
    setValue('#day', '1');
    setValue('#month', 'January');
    setValue('#year', '2022');
}
const unsetSelectedValues = (propertyValue) => {
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => { item.checked = false; });
}
const setTextValue = (id, value) => {
    const element = document.querySelector(id);
    element.textContent = value;
}
const setValue = (id, value) => {
    const element = document.querySelector(id);
    element.value = value;
}
const setSelectedValues = (propertyValue, value) =>
{
    let allItems = document.querySelectorAll(propertyValue);
    allItems.forEach(item => {
        if(Array.isArray(value))
        {
            if (value.includes(item.value))
            {
                item.checked = true;
            }
        }
        else if (item.value == value)
            item.checked = true;
    });
}
function checkForUpdate()
{
    const empJSON = localStorage.getItem('editEmp');
    isUpdate = empJSON ? true : false;
    if (!isUpdate)
    return;
    employeePayrollObject = JSON.parse(empJSON);
    setForm();
}