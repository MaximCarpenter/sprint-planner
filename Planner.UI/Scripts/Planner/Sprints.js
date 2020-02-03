
var sprints = [];
var statuses = [
    { id: 0, name: "Current" },
    { id: 1, name: "Completed" },
    { id: 2, name: "Canceled" }
];

function InitGrid() {
    $("#gridContainer").dxDataGrid({
        dataSource: sprints,
        keyExpr: "Id",
        showBorders: true,
        paging: {
            enabled: false
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
                dataField: "Name",
                caption: "Name"
            },
            {
                dataField: "Nr",
                caption: "Nr"
            },
            {
                dataField: "Start",
                caption: "Start",
                dataType: 'date',
                displayFormat: "shortdate"
            },
            {
                dataField: "End",
                caption: "End",
                dataType: 'date',
                displayFormat: "shortdate"
            },
            {
                dataField: "Status",
                caption: "Status",
                lookup: {
                    dataSource: statuses,
                    displayExpr: "name",
                    valueExpr: "id"
                }
            },
            {
                dataField: "Comments",
                visible: false
            }
        ],
    /*    summary: {
            groupItems: [{
                column: "Hrs",
                summaryType: "sum",
                displayFormat: "Total: {0} (hrs) of 24 (hrs)",
                showInGroupFooter: true
            }]
        },*/
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
                items: [
                    {
                        itemType: "group",
                        colCount: 2,
                        colSpan: 2,
                        items: [
                            "Name", {
                                dataField: "Nr",
                                editorType: "dxNumberBox"
                            },
                            {
                                dataField: "Start",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    displayFormat: "shortdate" ,
                                    dateSerializationFormat: "yyyy-MM-dd"
                                } 
                            },
                            {
                                dataField: "End",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    displayFormat: "shortdate",
                                    dateSerializationFormat: "yyyy-MM-dd"
                                } 
                            },
                            "Status"
                        ]
                    }
                ]
            }
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

function AddRecord(Sprint) {
    ShowLoadingPanel();
    Sprint.Id = 0;
    $.ajax({
        url: "../planner/api/sprints",
        type: 'post',
        async: false,
        dataType: 'json',
        data: Sprint,
        success: function (data) {
            Sprint.Id = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            $("#gridContainer").dxDataGrid("instance").refresh();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}


function EditRecord(Sprint) {
    ShowLoadingPanel();
    $.ajax({
        url: "../planner/api/sprints",
        type: 'put',
        async: false,
        data: Sprint,
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
        url: "../planner/api/sprints/" + item.Id,
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

    $.get("../planner/api/sprints")
        .done(function(data) {
            sprints = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            success();
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}