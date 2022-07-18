const stringifyDate = (date) =>{
    const options ={day:'numeric', month:'short', year:'numeric'};
    const newDate = !date ? "undefined" :new Date(Date.parse(date)).toLocaleDateString('en-GB', options);
    return newDate;
}

function update(node)
{
    let employeeData = empPayrollList.find(empData => empData.id == node.id);
    if(!employeeData){return;} 
    localStorage.setItem('editEmp', JSON.stringify(employeeData));
    window.open(SiteProperties.AddEmployee);
    
}

function remove(node)
{
    let empData = empPayrollList.find(emp => emp.id == node.id);
    if (!empData)
    return;
    const index = empPayrollList.map(emp => emp.id).indexOf(empData.id);
    empPayrollList.splice(index, 1);
    if(SiteProperties.use_local_storage.match("true"))
    {
        localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
        document.querySelector('.emp-count').textContent = empPayrollList.length;
        createInnerHTML();
        window.location.replace(SiteProperties.HomePage);
    }
    else{
        const deleteUrl = SiteProperties.server_url + empData.id.toString();
        makeServiceCall("DELETE", deleteUrl, false)
            .then(responseText =>{
                createInnerHTML();
            })
            .catch(error =>{
                console.log("Delete Error Status: " + JSON.stringify(error));
            });
    }
}
function checkName(name)
{
    let nameRegex = RegExp('^[A-Z]{1}[a-zA-Z\\s]{2,}$');
    if (!nameRegex.test(name)) throw 'Name is Incorrect!';
}

function checkStartDate(startDate)
{
    let now = new Date();
    if (startDate > now)
    {
        throw "Start Date should not future date."
    }
    var diff = Math.abs(now.getTime() - startDate.getTime());
    if (diff/(1000 * 60 * 60 * 24) > 30)
    {
        throw "Start date is beyond 30 days."
    }
}