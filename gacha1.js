(function(){
    /**
     * @class Gacha
     */
    function Gacha() {

        /**
         * @property ItemMaster
         */
        this.itemMaster = new ItemMaster();

        /**
         * @property 履歴
         */
        this.histories = [];

        /**
         * ただデータを引くだけ
         * @method draw
         * @return {String} ガチャのItem
         */
        this.draw = function(){
            var list;
            try {
                list = this.itemMaster.getTargetList(Math.random() * 100);
            } catch(e){
                list = this.itemMaster.normalList();
            }
            var rand = Math.floor( Math.random() * list.length );

            this.histories.push(list[rand]);
            return list[rand];
        };

        // View用

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
            list = this.itemMaster.toAllList();
            for( i=0;i<list.length;i++ ) {
                a = list[i];
                if( this.histories.indexOf(a) == -1 ) {
                    ret.push(a);
                }
            }
            return ret.length == 0 ? 'Complete!' : ret.sort().join(delimiter);
        }

        this.viewRestByTable = function() {
            var rest    = this.itemMaster.findRest(this.histories),
                table   = $("<table>").attr("border",1),
                colspan = 1,
                trlist  = [];

            for (var key in rest) {
                if ( rest[key].length > colspan ) {
                    colspan = rest[key].length;
                }
                var tr = $("<tr>");
                for (var i=0; i < rest[key].length; i++) {
                    tr.append(
                        $("<td>").text(rest[key][i])
                    );
                }
                trlist.push(tr)
            }
            table.append(
                $("<tr>").append(
                    $("<th>")
                    .attr("colspan", colspan)
                    .text("未習得！")
                )
            );
            table.append(trlist);
            return table;
        };

        /**
         * ガチャItemの管理
         * @class ItemMaster
         */
        function ItemMaster() {

            /**
             * @method init
             */
            this.init = function() {
                this.items = {
                    normal: {
                        rate:1,
                        range:[0,100],
                        list:[]
                    },
                    rare: {
                        rate:5,
                        range:[0,100],
                        list:[]
                    }
                };
                for(i=97;i<123;i++){
                    this.items.normal.list.push(String.fromCharCode(i));
                }
                this.items.rare.list = ["A","B","C"];
                this.items = decideRateRange(this.items);
            }

            this.findRest = function(histories) {
                var list  = [],
                    item,
                    retObj = {};
                for ( r in this.items ) {
                    list = [];
                    for (var i=0; i < this.items[r]["list"].length;i++) {
                        item = this.items[r]["list"][i];
                        if( histories.indexOf(item) == -1 ) {
                            list.push(item);
                        } else {
                            list.push("◯");
                        }
                    }
                    retObj[r] = list;
                }
                return retObj;
            };

            this.getItems = function(){
                return this.items;
            };

            /**
             * 対象となるItemリスト取得に失敗した時用
             * @method normalList
             * @return array
             */
            this.normalList = function() {
                return this.items["normal"]["list"];
            }

            /**
             * @method toAllList
             * @return array
             */
            this.toAllList = function(){
                retList = [];
                for( r in this.items ) {
                    retList = retList.concat(this.items[r]["list"]);
                }
                return retList;
            }

            /**
             * @method getTargetList
             * @param {Number} rate 0.0 - 100.0の値
             * @throws 
             */
            this.getTargetList = function(rate) {
                for (i  in this.items) {
                    min = this.items[i]["range"][0];
                    max = this.items[i]["range"][1];
                    if ( min <= rate && rate < max ) {
                        return this.items[i]["list"];
                    }
                }
                throw "INVALID RATE";
            }

            /**
             * レア度を0~100のレンジに落としこむ
             * @method decideRateRange
             * @param {object} items
             * @return {object} items
             */
            var decideRateRange = function(items){
                var rateUnit = solveRateUnitEquation(items),
                    max = 100,
                    min = 0;
                for (i in items) {
                    max = rateUnit / items[i]["rate"] + min;
                    items[i]["range"] = [min, max];
                    min = max;
                }
                return items;
            }

            /**
             * レア度を0~100に落としこんだ際の単位
             * @method solveRateUnitEquation
             * @param {object} items
             * @return {object} items
             */
            var solveRateUnitEquation = function(items) {
                var rateUnit = 0,
                    sum = 0;
                for( r in items ) {
                    sum += 1 / items[r]["rate"];
                }
                rateUnit = 100 / sum;
                return rateUnit;
            }

            this.init();
        };

        function ItemCounter(item) {
            this.itemToCountMap = {};
            this.init = function(item){
                for (var i=0; i < item.length; i++) {
                    this.itemToCountMap[item[i]] = 0;
                }
            }

            this.has = function(str) {
                return typeof this.itemToCountMap[str] !== "undefined";
            };

            this.plus = function(str) {
                this.itemToCountMap[str]++;
            };

            this.getMap = function(){
                return this.itemToCountMap;
            };

            this.init(item);
        }

    };

    // 実行

    var Gacha = new Gacha();

    $("#start").click(function(){
        $("#result").text(Gacha.draw());
        $("#histories").html(Gacha.viewHistories());
        $("#rest").html(Gacha.viewRestByTable());
//        $("#rest").html(Gacha.viewRest());
    });
}());
