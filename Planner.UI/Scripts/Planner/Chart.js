

function InitChart() {
    $(function () {
        var chart = $("#chart").dxChart({
            palette: "Violet",
            width: "",
            dataSource: dataSource,
            commonSeriesSettings: {
                argumentField: "date",
                type: "line"
            },
            size: { width: 1000, height: 300 },
            margin: {
                bottom: 20
            },
            argumentAxis: {
                valueMarginsEnabled: false,
                discreteAxisDivisionMode: "crossLabels",
                grid: {
                    visible: true
                }
            },
            series: [
                { valueField: "tickets", name: "tickets" },
            ],
            legend: {
                verticalAlignment: "bottom",
                horizontalAlignment: "center",
                itemTextPosition: "bottom"
            },
            title: {
                text: "Burndown chart",
                subtitle: {
                    text: "(Millions of Tons, Oil Equivalent)"
                }
            },
            "export": {
                enabled: true
            },
            tooltip: {
                enabled: true
            }
        }).dxChart("instance");
    });
}

var dataSource = [
    {
        date: new Date(2020, 1, 1),
        tickets: 30
    }, {
        date: new Date(2020, 1, 2),
        tickets: 28
    }, {
        date: new Date(2020, 1, 5),
        tickets: 25
    }, {
        date: new Date(2020, 1, 6),
        tickets: 20
    }, {
        date: new Date(2020, 1, 8),
        tickets: 1
    }, {
        date: new Date(2020, 1, 10),
        tickets: 0
    }
];


function GetRecords(success) {
    ShowLoadingPanel();
    $.get("../planner/api/sprints")
        .done(function(data) {
            dataSource = data;
            $("#loadPanel").dxLoadPanel("instance").hide();
            success();
        }).fail(function(xhr, textStatus, error) {
            $("#loadPanel").dxLoadPanel("instance").hide();
            DevExpress.ui.notify(error.toString(), "error");
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