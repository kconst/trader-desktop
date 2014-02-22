/**
 * Created by kconst on 2/18/14.
 */
define(
    [
        'app/domain/Repository',
        'backbone',
        'keel/BaseView',
        'text!app/widgets/tradeModal/TradeModalTemplate.html'
    ],
    function(Repository, Backbone, BaseView, TradeModalTemplate) {
        'use strict';

        return BaseView.extend({
            className : 'createTradeModal',

            template: {
                name: 'TradeModalTemplate',
                source: TradeModalTemplate
            },

            events: {
                'click .create': 'createTrade',
                'click .close': 'remove',
                'click .cancel': 'remove'
            },

            render: function() {
                var template = this.getTemplate();
                /*var context = this.collection.toJSON();*/

                // Destroy existing children
                this.destroyChildren();

                this.$el.html(template());

                this._setupElements();

                return this;
            },

            createTrade : function() {
                var loggedInUserId = Repository.getloggedInUser(),
                    value = this.$el.find('input[type="text"]').val(),
                    randomInstrument,
                    instruments = Repository.getInstruments();

                // validation
                if (value.match(/^\d+$/) === null || !loggedInUserId) {
                    console.warn('Invalid data supplied.');

                    return;
                }

                while (value > 0) {
                    randomInstrument = instruments.at(Math.floor(Math.random() * (instruments.length-1)));

                    Repository.createOrder({
                        "side": value % 2 ? 'Buy' : 'Sell',
                        "symbol": randomInstrument.attributes.symbol,
                        "quantity": Math.floor(Math.random() * (1000 - 100) + 100),
                        "limitPrice": Math.floor(Math.random() * (1000 - 1) + 1),
                        "traderId": loggedInUserId.attributes.id
                    });

                    value -= 1;
                }

                this.remove();

                return false;
            }
        });
    }
);