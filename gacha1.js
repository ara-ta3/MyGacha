(function(){
    function Gacha() {
        function GachaList() {
            this.list = [];
            this.init = function() {
                this.list = [];
                for(i=97;i<123;i++){
                    this.list.push(String.fromCharCode(i));
                }

                this.addSpecial(5, 'A');
                this.addSpecial(5, 'B');
                this.addSpecial(5, 'C');
            }

            this.addSpecial = function(rateToNormal, value) {
                while(rateToNormal--) this.list.push(value);
            }

            this.toList = function(){
                return this.list;
            }

            this.init();
        };

        this.gList = new GachaList();
        this.list = this.gList.toList();
        this.histories = [];

        this.draw = function(){
            var rand = Math.floor( Math.random() * this.list.length );
            this.histories.push(this.list[rand]);
            return this.list[rand];
        };

        this.viewHistories = function(delimiter) {
            if(typeof delimiter === 'undefined') {
                delimiter = ' ';
            }
            return this.histories.join(delimiter);
        }

        this.viewRest = function(delimiter){
            if(typeof delimiter === 'undefined') {
                delimiter = ' ';
            }

            ret = [];
            for( i=0;i<this.list.length;i++ ) {
                a = this.list[i];
                if( this.histories.indexOf(a) == -1 ) {
                    ret.push(a);
                }
            }
            return ret.length == 0 ? 'Complete!' : ret.sort().join(delimiter);
        }
    };

    var Gacha = new Gacha();

    $("#start").click(function(){
        $("#result").text(Gacha.draw());
        $("#histories").html(Gacha.viewHistories());
        $("#rest").html(Gacha.viewRest());
    });
}());
