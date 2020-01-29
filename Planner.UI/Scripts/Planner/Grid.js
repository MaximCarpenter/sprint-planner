
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
         
            AddRecord(e.data);
        },
        onRowUpdated: function (e) {
           
            EditRecord(e.data);
        },
        onRowRemoved: function (e) {
          
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

function AddRecord(Ticket) {
    ShowLoadingPanel();
    Ticket.Id = 0;
    $.ajax({
        url: "../planner/api/tickets",
        type: 'post',
        async: false,
        dataType: 'json',
        data: Ticket,
        success: function (data) {
            Ticket.Id = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            $("#gridContainer").dxDataGrid("instance").refresh();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}


function EditRecord(Ticket) {
    ShowLoadingPanel();
    $.ajax({
        url: "../planner/api/tickets",
        type: 'put',
        async: false,
        data: Ticket,
        dataType: 'json',
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

    $.ajax({
        url: "../planner/api/tickets/" + item.Id,
        type: 'delete',
        async: false,
       // dataType: 'json',
        contentType: "application/json; charset=utf-8",
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
    ShowLoadingPanel();

    $.get("../planner/api/tickets")
        .done(function(data) {
            tickets = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            success();
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}