function filterContainer(container, filterText) {
    var t = $(container).children('tbody').children('tr');
    if(t.length === 0) {
        t =  $(container).children();
    }
    t.each(function () {
        var entry = $(this);
        if(!filterText) {
            entry.show();
            return;
        }

        var nameContainer = entry.children('td').eq(1);
        if(nameContainer.length == 0) {
            nameContainer = entry.find('.info h3');
        }
        var name = nameContainer.text().toLowerCase();
        if(name.indexOf(filterText) !== -1) {
            entry.show();
        } else {
            entry.hide();
        }
    });
}

$(document).ready(function () {
    $('.filterable').each(function () {
        var container = $(this);
        var control = $('#' + container.data('filterField'));
        control.on('keyup', function(evt) {
            filterContainer(container, control.val().toLowerCase());
        });
    });
});