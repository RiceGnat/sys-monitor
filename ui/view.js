function SysMonView(container) {
    var self = this;
    var $container = $(container);
    var units = ["", "K", "M", "G", "T"];

    function generateId(source, property, index) {
        return source + "-" + property + "-" + index;
    }

    function splitId(id) {
        return id.split("-");
    }

    function $createColumn(label) {
        return $("<div>", { "class": "column" });
    }

    function $createStack() {
        return $("<div>", { "class": "stack" });
    }

    function $createCard(source, type, index) {
        var $card = $("<div>", {
            "id": generateId(source, type, index),
            "class": "card noselect " + type,
            "data-source": source
        });
        $("<div>", { "class": "label" }).appendTo($card);
        var $values = $("<div>", { "class": "value-container" }).appendTo($card);
        $("<div>", { "class": "left value" }).appendTo($values);
        $("<div>", { "class": "right value" }).appendTo($values);
        return $card;
    }

    self.isViewReady = function () {
        return !$container.is(":empty");
    }

    self.initializeView = function (data) {
        $container.empty();
        data.forEach(function (source) {
            var $column = $createColumn().appendTo($container);

            Object.keys(source.sensors).forEach(function (property) {
                if (source.sensors[property].length > 0) {
                    var $stack = $createStack().appendTo($column);

                    // TODO: create special card for cpu

                    source.sensors[property].forEach(function (element, index) {
                        $createCard(source.name, property, index).data(element).appendTo($stack);
                    });
                }
            });
        });
    }

    self.loadView = function (xml) {
        $container.empty();
        $("column", xml).each(function (index) {
            var $column = $createColumn().appendTo($(".column-container", $page));
            $("stack", this).each(function (index) {
                var $stack = $createStack().appendTo($column);
                $(this).children().each(function (index) {
                    $createCard(this.id).appendTo($stack);
                });
            });
        });
    }

    function bindNewData(data) {
        data.forEach(function (source) {
            Object.keys(source.sensors).forEach(function (property) {
                // TODO: bind whole cpu stack to card

                source.sensors[property].forEach(function (element, index) {
                    $(".card#" + generateId(source.name, property, index), $container).data(element);
                });
            });
        });
    }

    function drawCards(data) {
        $(".card", $container).each(function (index) {
            var $card = $(this);
            var item = $card.data();
            var type = splitId(this.id)[1];

            switch (type) {
                case "cpu":
                    // TODO: draw collapsible cpu card

                    var name = item.name.replace(/\(R\)/g, "");
                    var clock = item.clock;

                    var prefix = 2;
                    while (clock >= 1000) {
                        clock /= 1000;
                        prefix++;
                    }

                    $(".label", $card).text(name).prop("title", name);
                    $(".left.value", $card).text(clock + " " + units[prefix] + "Hz");
                    $(".right.value", $card).text(item.usage + "%");
                    break;
                case "memory":
                    var free = item.free;
                    var total = item.total;

                    var prefix = 0;
                    while (total >= 1000) {
                        total /= 1024;
                        free /= 1024;
                        prefix++;
                    }

                    $(".label", $card).text("Memory");
                    $(".left.value", $card).text(free.toPrecision(3) + "/" + total.toPrecision(3) + " " + units[prefix] + "B");
                    $(".right.value", $card).text(Math.trunc(free / total * 100) + "%");
                    break;
                case "disks":
                    var free = item.freeSpace;
                    var total = item.size;

                    var prefix = 0;
                    while (total >= 1000) {
                        total /= 1024;
                        free /= 1024;
                        prefix++;
                    }

                    $(".label", $card).html(item.name + "&ensp;" + item.volumeName).prop("title", item.volumeName);
                    $(".left.value", $card).text(free.toPrecision(3) + "/" + total.toPrecision(3) + " " + units[prefix] + "B");
                    $(".right.value", $card).text(Math.trunc(free / total * 100) + "%");
                    break;
            }

            if ($(".label", $card).text() == $(".label", $card.prev()).text()) {
                $card.addClass("sub");
            }
            else {
                $card.removeClass("sub");
            }
        });
    }

    self.update = function (data) {
        bindNewData(data);
        drawCards(data);
    }
}
