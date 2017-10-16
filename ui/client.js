function SysMonClient($page) {
    var data;
    var xml;
    var timeout;
    var self = this;

    var units = ["", "K", "M", "G", "T"];

    this.sources = [];
    this.data = [];
    this.pollInterval = 1000;

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

        data.forEach(function (source) {
            var column = xml.createElement("column");
            xml.documentElement.appendChild(column);
            column.setAttribute("label", source.name);

            Object.keys(source.sensors).forEach(function (property) {
                var stack;
                if (source.sensors[property].length > 0) {
                    stack = xml.createElement("stack");
                    column.appendChild(stack);

                    // TODO: create special card for cpu

                    source.sensors[property].forEach(function (element, index) {
                        var card = xml.createElement("card");
                        card.setAttribute("id", generateId(property, index));
                        stack.appendChild(card);
                    });
                }
            });
        });
    }

    function buildLayout() {
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
        data.forEach(function (source) {
            Object.keys(source.sensors).forEach(function (property) {
                // TODO: bind whole cpu stack to card

                source.sensors[property].forEach(function (element, index) {
                    $(".card#" + generateId(property, index), $page).data(element);
                    // TODO: add xml node if new data item is found
                });
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

    function pollSources(srcIndex) {
        if (self.sources.length == 0) {
            timeout = setTimeout(poll, self.pollInterval);
            return;
        }
        $.get(self.sources[srcIndex].url, function (results) {
            data.push({
                name: self.sources[srcIndex].name,
                sensors: results
            });

            if (srcIndex < self.sources.length - 1) {
                pollSources(srcIndex + 1);
            }
            else {
                if (!xml) {
                    generateInitialXML();
                    buildLayout();
                }

                bindData();
                updateAll();

                self.data = data;
                timeout = setTimeout(poll, self.pollInterval);
            }
        });
    }

    function poll() {
        data = [];
        pollSources(0);
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
}
