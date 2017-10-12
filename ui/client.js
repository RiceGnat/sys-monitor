function SysMonClient($page) {
    var data;
    var xml;
    var timeout;

    var endpoint = "http://localhost:8080/sys";
    var units = ["", "K", "M", "G", "T"];

    function generateId(property, index) {
        return property + "-" + index;
    }

    function typeFromId(id) {
        return id.split("-")[0];
    }

    function $buildCard(id) {
        var $card = $("<div>", { "id": id, "class": "card " + typeFromId(id) });
        $("<div>", { "class": "label" }).appendTo($card);
        var $values = $("<div>", { "class": "flexbox" }).appendTo($card);
        $("<div>", { "class": "left value" }).appendTo($values);
        $("<div>", { "class": "right value" }).appendTo($values);
        return $card;
    }

    function generateInitialXML() {
        var stack;

        xml = $.parseXML("<page/>");
        var column = xml.createElement("column");
        xml.documentElement.appendChild(column);

        Object.keys(data).forEach(function (property) {
            var stack;
            if (data[property].length > 0) {
                stack = xml.createElement("stack");
                column.appendChild(stack);
                data[property].forEach(function (element, index) {
                    var card = xml.createElement("card");
                    card.setAttribute("id", generateId(property, index));
                    stack.appendChild(card);
                });
            }
        });
    }

    function buildLayout() {
        //$("#main").empty();
        $("column", xml).each(function (index) {
            var $column = $("<div>", { "class": "column" }).appendTo($(".column-container", $page));
            $("stack", this).each(function (index) {
                var $stack = $("<div>", { "class": "stack" }).appendTo($column);
                $(this).children().each(function (index) {
                    $buildCard(this.id).appendTo($stack);
                });
            });
        });
    }

    function bindData() {
        Object.keys(data).forEach(function (property) {
            data[property].forEach(function (element, index) {
                $(".card#" + generateId(property, index), $page).data(element);
                // TODO: add xml node if new data item is found
            });
        });
    }

    function updateAll() {
        $(".card", $page).each(function (index) {
            var $card = $(this);
            var item = $card.data();
            var type = typeFromId(this.id);

            switch (type) {
                case "cpu":
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

    function poll() {
        $.get(endpoint, function (results) {
            data = results;

            if (!xml) {
                generateInitialXML();
                buildLayout();
                console.log();
            }

            bindData();
            updateAll();

            this.data = data;
            timeout = setTimeout(poll, 1000);
        });
    }

    this.start = function () {
        poll();
    }

    this.stop = function () {
        clearTimeout(timeout);
        timeout = null;
    }

    this.loadLayout = function (xmlString) {
        xml = $.parseXML(xmlString);
    }

    this.getLayout = function () {
        new XMLSerializer().serializeToString(xml);
    }

    this.endpoints = [];
}
