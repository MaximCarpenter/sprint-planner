
var itemsToolbar = [
    { text: "Sprints", url: "", icon: "runner" },
    { text: "Tickets", icon: "clock" },
    { text: "Members", icon: "group"},
    { text: "Chart", icon: "chart" }
];
function InitNavBar () {
    $("#navigation").dxNavBar({
        dataSource: itemsToolbar,
        selectionMode: "single",
        selectedIndex:1,
        onItemSelectionChanged: function(e) {
        }
    });
}
