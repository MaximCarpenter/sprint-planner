
var itemsToolbar = [
    { text: "Sprints", url: "../planner/sprints", icon: "runner" },
    { text: "Tickets", url: "../planner/tickets", icon: "clock" },
    { text: "Members", url: "../planner/members", icon: "group"},
    { text: "Chart", url: "../planner/chart", icon: "chart" }
];

function InitNavBar() {
   var index = CurrentIndex();
    $("#navigation").dxNavBar({
        dataSource: itemsToolbar,
        selectionMode: "single",
        selectedIndex: index,
        onSelectionChanged: function (e) {
            window.location.href = e.addedItems[0].url;
        }
    });
}

function CurrentIndex() {
    if (window.location.href.indexOf("sprints") > -1) return 0;
    if (window.location.href.indexOf("tickets") > -1) return 1;
    if (window.location.href.indexOf("members") > -1) return 2;
    if (window.location.href.indexOf("chart") > -1) return 3;
    return 1;
}