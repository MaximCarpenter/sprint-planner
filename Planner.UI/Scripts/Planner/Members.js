
var members = [];

function InitGrid() {
    $("#gridContainer").dxDataGrid({
        dataSource: members,
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
            }
        ],
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
                        items: ["Name"]
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

function AddRecord(Member) {
    ShowLoadingPanel();
    Member.Id = 0;
    $.ajax({
        url: "../planner/api/members",
        type: 'post',
        async: false,
        dataType: 'json',
        data: Member,
        success: function (data) {
            Member.Id = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            $("#gridContainer").dxDataGrid("instance").refresh();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}


function EditRecord(Member) {
    ShowLoadingPanel();
    $.ajax({
        url: "../planner/api/members",
        type: 'put',
        async: false,
        data: Member,
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
        url: "../planner/api/members/" + item.Id,
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

    $.get("../planner/api/members")
        .done(function(data) {
            members = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            success();
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}