export const Columns = (actionsFormatter) =>[{
    dataField: "patient.id",
    text: "ID",
    sort: true
}, {
    dataField: "patient.firstName",
    text: "First Name",
    sort: true
},
{
    dataField: "patient.middleName",
    text: "Middle Name",
    sort: true,

}
, {
    dataField: "patient.lastName",
    text: "Last Name",
    sort: true,

}, {
    dataField: "patient.phone",
    text: "PhoneNumber",
    sort: true
},
{
    dataField: "patient.number",
    text: "Land Line Number",
    sort : true ,
    hidden : true
},
{
    dataField: "patient.user.email",
    text: "Email",
    sort : true ,
    hidden : true
}
, {
    dataField: "patient.user.username",
    text: "User Name",
    hidden: true
}, {
    dataField: "patient.gender",
    text: "Gender",
    hidden: true
},
{
    dataField: "patient.weight",
    text: "Weight",
    hidden: true
} 
, {
    dataField: "patient.length",
    text: "Height",
    hidden: true
}, {
    dataField: "patient.birthday",
    text: "BirthDate",
    hidden: true
},
{
    dataField: "patient.user.userId",
    text: "UserID",
    hidden: true
}
, {
    dataField: "actions",
    text: "Actions",
    formatter: actionsFormatter,
    isDummyField: "true",
    csvExport: false,
}]
