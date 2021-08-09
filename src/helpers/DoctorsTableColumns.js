export const Columns = (actionsFormatter) => [{
    dataField: "doctor.id",
    text: "ID",
    sort: true
}, {
    dataField: "doctor.firstName",
    text: "First Name",
    sort: true
}, {
    dataField: "doctor.lastName",
    text: "Last Name",
    sort: true,

}, {
    dataField: "doctor.user.email",
    text: "Email",
    sort: true
}, {
    dataField: "doctor.phoneNumber",
    text: "PhoneNumber",
    sort: true
}, {
    dataField: "doctor.description",
    text: "description",
    hidden: true
}, {
    dataField: "doctor.sepecialize",
    text: "sepecialize",
    hidden: true
}, {
    dataField: "doctor.language",
    text: "language",
    hidden: true
}, {
    dataField: "actions",
    text: "Actions",
    formatter: actionsFormatter,
    isDummyField: "true",
    csvExport: false,
}]
