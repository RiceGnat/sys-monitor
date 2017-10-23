function SysMonClient() {
    var data;
    var timer;
    var self = this;

    this.sources = [];
    this.data = [];
    this.pollInterval = 1000;

    function pollSources(srcIndex) {
        $.get(self.sources[srcIndex].url, function (results) {
            // Successful response
            data.push({
                name: self.sources[srcIndex].name,
                sensors: results
            });
        }).always(function () {
            if (srcIndex < self.sources.length - 1) {
                pollSources(srcIndex + 1);
            }
            else {
                self.data = data;
                timer = setTimeout(poll, self.pollInterval);

                // Trigger jQuery event
                $(self).trigger("update", [data]);
            }
        });
    }

    function poll() {
        data = [];

        if (self.sources.length > 0) {
            pollSources(0);
        }
        else {
            timer = setTimeout(poll, self.pollInterval);
            self.data = data; // Clear previous data (in case sources were removed)
        }
    }

    this.start = function () {
        poll();
    }

    this.stop = function () {
        clearTimeout(timer);
        timer = null;
    }
}
