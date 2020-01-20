
var names = [{ PersonName: "Eugeniy" }, { PersonName: "Maksym" }, { PersonName: "Aleksey S" }, { PersonName: "Oleksii L" }];

var tickets = [];

function InitGrid() {
    $("#gridContainer").dxDataGrid({
        dataSource: tickets,
        keyExpr: "Id",
        showBorders: true,
        grouping: {
            autoExpandAll: true
        },
        paging: {
            enabled: false
        },
        groupPanel: {
            visible: true
        },
        filterRow: {
            visible: true,
            applyFilter: "auto"
        },
        searchPanel: {
            visible: true,
            width: 240,
            placeholder: "Search..."
        },
        columns: [
            {
                dataField: "PersonName",
                caption: "Name",
                width: 125,
                lookup: {
                    dataSource: names,
                    displayExpr: "PersonName",
                    valueExpr: "PersonName"
                },
                groupIndex: 0
            },
            {
                dataField: "TicketUrl",
                caption: "Ticket"
            },
            {
                dataField: "Hrs",
                caption: "Hours"
            },
            {
                dataField: "Notes",
                visible: false
            }
        ],
        summary: {
            groupItems: [{
                column: "Hrs",
                summaryType: "sum",
                displayFormat: "Total: {0} (hrs) of 24 (hrs)",
                showInGroupFooter: true
            }]
        },
        editing: {
            mode: "popup",
            allowUpdating: true,
            allowDeleting: true,
            allowAdding: true,
            popup: {
                title: "Add/Edit record",
                showTitle: true,
                width: 800,
                height: 350,
                position: {
                    my: "top",
                    at: "top",
                    of: window
                }
            },
            form: {
                items: [{
                    itemType: "group",
                    colCount: 2,
                    colSpan: 2,
                    items: ["PersonName", "TicketUrl", "Hrs", {
                        dataField: "Notes",
                        editorType: "dxTextArea",
                        colSpan: 2,
                        editorOptions: {
                            height: 100
                        }
                    }]
                }]
            }
        },
        "export": {
            enabled: true,
            fileName: "Sprint",
            allowExportSelectedData: false
        },
        onRowInserted: function (e) {
            return;
            AddRecord(e.data);
        },
        onRowUpdated: function (e) {
            return;
            EditRecord(e.data);
        },
        onRowRemoved: function (e) {
            return;
            DeleteRecord(e.data);
        }
    });
}

function ShowLoadingPanel() {
    if ($("#loadPanel")) {
        $("#loadPanel").remove();
    }
    $("<div />").attr("id", "loadPanel").appendTo(document.body);
    $("#loadPanel").dxLoadPanel({
        closeOnOutsideClick: false,
        visible: true,
        message: "Loading..."
    });
}

function AddRecord(item) {
    ShowLoadingPanel();
    item.Id = 0;
    var request = JSON.stringify({ 'item': item });
    $.ajax({
        url: "../Planner/Home/AddRecord",
        type: 'POST',
        async: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: request,
        success: function (data) {
            item.Id = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}


function EditRecord(item) {
    ShowLoadingPanel();
    var request = JSON.stringify({ 'item': item });
    $.ajax({
        url: "../Planner/Home/EditRecord",
        type: 'POST',
        async: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: request,
        success: function (data) {
            $("#loadPanel").dxLoadPanel("instance").hide();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}

function DeleteRecord(item) {
    ShowLoadingPanel();
    var request = JSON.stringify({ 'item': item });
    $.ajax({
        url: "../Planner/Home/DeleteRecord",
        type: 'POST',
        async: false,
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        data: request,
        success: function (data) {
            $("#loadPanel").dxLoadPanel("instance").hide();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}

function GetRecords(success) {
    success();
    return;
    ShowLoadingPanel();
    $.ajax({
        url: "../Planner/Home/GetRecords",
        type: 'POST',
        async: false,
        contentType: 'application/json',
        success: function (data) {
            tickets = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            success();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}