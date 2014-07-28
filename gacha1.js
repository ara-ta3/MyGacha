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

        /**
         * ガチャItemの管理
         * @class ItemMaster
         */
        function ItemMaster() {

            /**
             * @method init
             */
            this.init = function() {
                this.itemTypes = {
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
                    this.itemTypes.normal.list.push(String.fromCharCode(i));
                }
                this.itemTypes.rare.list = ["A","B","C"];
                this.itemTypes = decideRateRange(this.itemTypes);
            }

            /**
             * 対象となるItemリスト取得に失敗した時用
             * @method normalList
             * @return array
             */
            this.normalList = function() {
                return this.itemTypes["normal"]["list"];
            }

            /**
             * @method toAllList
             * @return array
             */
            this.toAllList = function(){
                retList = [];
                for( r in this.itemTypes ) {
                    retList = retList.concat(this.itemTypes[r]["list"]);
                }
                return retList;
            }

            /**
             * @method getTargetList
             * @param {Number} rate 0.0 - 100.0の値
             * @throws 
             */
            this.getTargetList = function(rate) {
                for (i  in this.itemTypes) {
                    min = this.itemTypes[i]["range"][0];
                    max = this.itemTypes[i]["range"][1];
                    if ( min <= rate && rate < max ) {
                        return this.itemTypes[i]["list"];
                    }
                }
                throw "INVALID RATE";
            }

            /**
             * レア度を0~100のレンジに落としこむ
             * @method decideRateRange
             * @param {object} itemTypes
             * @return {object} itemTypes
             */
            var decideRateRange = function(itemTypes){
                var rateUnit = solveRateUnitEquation(itemTypes),
                    max = 100,
                    min = 0;
                for (i in itemTypes) {
                    max = rateUnit / itemTypes[i]["rate"] + min;
                    itemTypes[i]["range"] = [min, max];
                    min = max;
                }
                return itemTypes;
            }

            /**
             * レア度を0~100に落としこんだ際の単位
             * @method solveRateUnitEquation
             * @param {object} itemTypes
             * @return {object} itemTypes
             */
            var solveRateUnitEquation = function(itemTypes) {
                var rateUnit = 0,
                    sum = 0;
                for( r in itemTypes ) {
                    sum += 1 / itemTypes[r]["rate"];
                }
                rateUnit = 100 / sum;
                return rateUnit;
            }

            this.init();
        };

    };

    // 実行

    var Gacha = new Gacha();

    $("#start").click(function(){
        $("#result").text(Gacha.draw());
        $("#histories").html(Gacha.viewHistories());
        $("#rest").html(Gacha.viewRest());
    });
}());
