
var names = [];
var tickets = [];
var sprints = [];
var selectedSprint = { Id: 0, Name: "Sprint" };
var skip = false;


var ticketsDataSource = new DevExpress.data.DataSource({
    loadMode: "raw",
    byKey: function(key) {
        var result = $.grep(tickets, function(item) { return item.Id === key; });
        if (result.length <= 0) return null;
        return result[0];
    },
    key: "Id",
    load: function () {
        return $.grep(tickets, function (val) { return val.SprintId === selectedSprint.Id; });
    },
    insert: function (value) {
        var addAction = function () {
            var promise = new Promise(function (resolve, reject) {
                AddRecord(value, resolve);
            });
            return promise;
        };
        var update = function updateSource() { tickets.push(value); };
        addAction().then(update);
    },
    update: function (key, values) {
        var itemIndex = tickets.findIndex(val => val.Id === key);

        if (values.Hrs !== undefined)
            tickets[itemIndex].Hrs = values.Hrs;
        if (values.Notes !== undefined)
            tickets[itemIndex].Notes = values.Notes;
        if (values.PersonId !== undefined)
            tickets[itemIndex].PersonId = values.PersonId;
        if (values.SprintId !== undefined)
            tickets[itemIndex].SprintId = values.SprintId;
        if (values.TicketUrl !== undefined)
            tickets[itemIndex].TicketUrl = values.TicketUrl;
        if (values.Resolved !== undefined)
            tickets[itemIndex].Resolved = values.Resolved;
        EditRecord(tickets[itemIndex]);
    },
    remove: function (key) {
        var deleteAction = function () {
            var promise = new Promise(function (resolve, reject) {
                DeleteRecord(key, resolve);
            });
            return promise;
        };
        var update = function updateSource() {
            tickets = $.grep(tickets, function(val) { return val.Id !== key; });
        };
        deleteAction().then(update);
    },
    paginate: true,
    pageSize: 100
});

function LoadTicketsSources() {

    var loadTickets = function () {
        var promise = new Promise(function (resolve, reject) {
            GetRecords(resolve);
        });
        return promise;
    };
    var loadSprints = function () {
        var promise = new Promise(function (resolve, reject) {
            GetSprints(resolve);
        });
        return promise;
    };
    var loadMembers = function () {
        var promise = new Promise(function (resolve, reject) {
            GetMembers(resolve);
        });
        return promise;
    };

    loadTickets()
        .then(loadSprints)
        .then(loadMembers)
        .then(InitGrid);
}

function InitGrid() {
    selectedSprint = getCurrentSprint();

    $("#gridContainer").dxDataGrid({
        dataSource: ticketsDataSource,
       // keyExpr: "Id",
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
                dataField: "PersonId",
                caption: "Name",
                width: 125,
                lookup: {
                    dataSource: names,
                    displayExpr: "Name",
                    valueExpr: "Id"
                },
                groupIndex: 0
            },
            {
                dataField: "TicketUrl",
                caption: "Ticket",
                cellTemplate: function (container, options) {
                    container.empty();
                    if (options.value === null) return;

                    var textIndex = options.value.indexOf("APP-");
                    var text = options.value.substring(textIndex);
                    var link = $('<a>', { text: text, href: options.value, target: "_blank" });
                    container.append(link);
                    return;
                }
            },
            {
                dataField: "Hrs",
                caption: "Hours"
            },
            {
                dataField: "Notes",
                visible: false
            },
            {
                dataField: "SprintId",
                caption: "Sprint",
                visible: false,
                lookup: {
                    dataSource: sprints,
                    displayExpr: "Name",
                    valueExpr: "Id"
                }
            },
            {
                dataField: 'Resolved',
                caption: 'Resolved',
                cellTemplate: function (container, options) {
                    container.empty();
                    var key = options.key;
                    $("<div id='resolved_" + key + "'>").appendTo(container);
                    $("#resolved_" + key).dxCheckBox({
                        value: options.value !== null,
                        onValueChanged: function (e) {
                            if (skip) {
                                skip = false;
                                return;
                            }
                            if (e.value)
                                GenerateResolveDatePopup(key);
                            else 
                                ticketsDataSource.store().update(key, { Resolved: null });
                        }
                    }).dxCheckBox("instance");
                }
            }
        ],
        summary: {
            groupItems: [
                {
                    column: "Hrs",
                    summaryType: "sum",
                    displayFormat: "Total: {0} (hrs) of " + CalculateLeewayHours() + " (hrs)",
                    showInGroupFooter: true
                }
            ]
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
                height: 400,
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
                            {
                                dataField: "PersonId",
                                caption: "Name",
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    items: names,
                                    displayExpr: "Name",
                                    valueExpr: "Id"
                                }
                            },
                            "TicketUrl", {
                                dataField: "Hrs",
                                editorType: "dxNumberBox"
                            },
                            {
                                dataField: "SprintId",
                                caption: "Sprint",
                                editorType: "dxSelectBox",
                                editorOptions: {
                                    items: sprints,
                                    displayExpr: "Name",
                                    valueExpr: "Id"
                                }
                            },
                            {
                                dataField: "Resolved",
                                caption: "Resolved",
                                editorType: "dxDateBox",
                                editorOptions: {
                                    showClearButton: true,
                                    displayFormat: "shortdate" ,
                                    dateSerializationFormat: "yyyy-MM-dd"
                                }  
                            },
                            {
                                dataField: "Notes",
                                editorType: "dxTextArea",
                                colSpan: 1,
                                editorOptions: { height: 100 }
                            }
                        ]
                    }
                ]
            }
        },
        "export": {
            enabled: true,
            fileName: selectedSprint.Name,
            allowExportSelectedData: false
        },
        onToolbarPreparing: function (e) {
            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxTextBox",
                    options: {
                        text: CalculateLeewayDays() + "",
                        readOnly: true
                    }
                });
            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxTextBox",
                    options: {
                        text: "End: " + new Date(selectedSprint.End).toLocaleDateString(),
                        readOnly: true
                    }
                });
            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxTextBox",
                    options: {
                        text: "Start: " + new Date(selectedSprint.Start).toLocaleDateString(),
                        readOnly: true
                    }
                });
            e.toolbarOptions.items.unshift(
                {
                    location: "before",
                    widget: "dxSelectBox",
                    options: {
                        dataSource: sprints,
                        valueExpr: 'Id',
                        displayExpr: 'Name',
                        value: selectedSprint.Id,
                        onValueChanged: function(s) {
                            selectedSprint = $.grep(sprints,
                                function (val) { return val.Id === s.value; })[0];

                            $("#gridContainer").dxDataGrid("instance").repaint();
                            $("#gridContainer").dxDataGrid("instance").refresh();
                        }
                    }
                });
        }

    });
}

function getCurrentSprint() {
    var today =getToday();
    var current = $.grep(sprints,
        function(val) {
            return new Date(val.Start) <= today && new Date(val.End) >= today;
        })[0];
    if (current === undefined || current === null)
        current = { Id: 0, Name: "Sprint" };
    return current;
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

function AddRecord(Ticket, resolve) {
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
            resolve();
            $("#loadPanel").dxLoadPanel("instance").hide();
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

function DeleteRecord(id, resolve) {
    ShowLoadingPanel();

    $.ajax({
        url: "../planner/api/tickets/" + id,
        type: 'delete',
        async: false,
       // dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            resolve();
        },
        error: function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        }
    });
}

function GetRecords(resolve) {
    ShowLoadingPanel();

    $.get("../planner/api/tickets")
        .done(function(data) {
            tickets = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            resolve();
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}

function GetSprints(resolve) {
    ShowLoadingPanel();

    $.get("../planner/api/sprints")
        .done(function(data) {
            sprints = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            resolve(resolve);
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}

function GetMembers(resolve) {
    ShowLoadingPanel();

    $.get("../planner/api/members")
        .done(function (data) {
            names = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            resolve(resolve);
        }).fail(function (xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
        });
}


function CalculateLeewayDays() {
    var today = getToday();
    if (selectedSprint.Start === undefined) return 0;
    if (new Date(selectedSprint.Start) > today)
        return "Pending";

    var end = new Date(selectedSprint.End);
    var diff = Math.round((end - today) / (1000 * 60 * 60 * 24)) + 2;
    if (diff < 0)
        return "Expired";

    return diff + " day(s) to end";
}

function CalculateLeewayHours() {
    return 50;
    console.log(selectedSprint);
    if (selectedSprint.Start === undefined) return 0;
    var start = new Date(selectedSprint.Start);
    var end = new Date(selectedSprint.End);
    var diff = Math.round((end - start) / (1000 * 60 * 60)) + 24;
    var leeway = selectedSprint.Leeway * diff / 100;

    var people = names.length;

    if (people === 0)
        return diff;
    return (diff / people).toFixed(2);

    //return (diff - leeway).toFixed(2);
    //return (diff - leeway).toFixed(2)/;
}

function getToday() {
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    return new Date(date);
}

function GenerateResolveDatePopup(id) {
    var popup = null,
        popupOptions = {
            width: 300,
            height: 250,
            contentTemplate: function () {
                return $("<span />")
                    .append("<div style='height: 30px' class='dx-fieldset'>" +
                        "<span>Resolve date</span>" +
                        "<div id='date_" + id +"'></div>" +
                        "<div style='padding-top: 20px; float:right;'><div id='submit' style='margin-right:15px'></div>" +
                        "<div id='cancel'></div>" +
                        "</div>");
            },
            showTitle: true,
            title: "Resolve",
            visible: true,
            dragEnabled: true,
            closeOnOutsideClick: false,
            onHidden: function () { $("#popup").remove(); },
            onShown: function () {
                $("#date_" + id).dxDateBox({
                    displayFormat: "shortdate",
                    dateSerializationFormat: "yyyy-MM-dd"
                });

                $("#date_" + id).dxDateBox("instance").option("value", new Date().toISOString());

                $('#submit').dxButton({
                    text: 'Submit',
                    type: 'success',
                    onClick: function (e) {
                        var date = $("#date_" + id).dxDateBox("instance").option("value");
                        ticketsDataSource.store().update(id, { Resolved: date });
                        popup.hide();
                    }
                });
                $("#cancel").dxButton({
                    text: "Cancel",
                    onClick: function (e) {
                        skip = true;
                        $("#resolved_" + id).dxCheckBox("instance").option("value", false);
                        popup.hide();
                    }
                });
            }
        };
    var $popupContainer = $("<div />")
        .attr("id", "popup")
        .appendTo(document.body);
    popup = $popupContainer.dxPopup(popupOptions).dxPopup("instance");
    popup.show();
}