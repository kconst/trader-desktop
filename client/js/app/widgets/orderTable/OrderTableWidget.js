/**
 * Created by kconst on 2/18/14.
 */
define(
    [
        'app/domain/Repository',
        'backbone',
        'keel/BaseView',
        'text!app/widgets/orderTable/OrderTableTemplate.html',
        'app/widgets/tradeModal/TradeModalWidget',
        'keel/MessageBus'
    ],
    function(Repository, Backbone, BaseView, OrderTableTemplate, TradeModalWidget, MessageBus) {
        'use strict';

        return BaseView.extend({
            className : 'traderWidget',

            template: {
                name: 'OrderTableTemplate',
                source: OrderTableTemplate
            },

            events: {
                'click .delete': 'deleteAll',
                'click .refresh': 'render',
                'click .makeTrade': 'makeTrade'
            },

            initialize : function(){
                Handlebars.registerHelper("formatDate", function(timestamp) {
                    var dateFormat = new Date(timestamp),
                        minutes = dateFormat.getMinutes() + 1 + '',
                        hours = dateFormat.getHours() + 1 + '',
                        offset = dateFormat.getHours() > 11 ? 'PM' : 'AM';

                    if (minutes.length < 2) {
                        minutes = '0' + minutes;
                    }

                    if (hours.length < 2) {
                        hours = '0' + hours;
                    }

                    dateFormat = [(dateFormat.getMonth() + 1), '/', dateFormat.getDate(), '/', dateFormat.getFullYear(), ' ', hours, ':', minutes, ':', (dateFormat.getSeconds() + 1), ' ', offset].join('');

                    return dateFormat;
                });

                Handlebars.registerHelper('formatCurrency', function(value) {
                    value = value.search('.') !== -1 ? value + '.00' : value;

                    return value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                });

                this.listenTo(MessageBus, 'orderCreatedEvent', function(){
                    this.collection.fetch().done(this.render.bind(this));
                });

                this.listenTo(MessageBus, 'placementCreatedEvent', function(){
                    this.collection.fetch().done(this.render.bind(this));
                });

                this.listenTo(MessageBus, 'executionCreatedEvent', function(){
                    this.collection.fetch().done(this.render.bind(this));
                });

                this.listenTo(MessageBus, 'allOrdersDeletedEvent', function(){
                    this.collection.fetch().done(this.render.bind(this));
                });
            },

            render: function() {
                var template = this.getTemplate();
                var context = this.collection.toJSON();

                // Destroy existing children
                this.destroyChildren();

                if (!Repository.getloggedInUser()) {
                    console.warn('Not logged in.');

                    return;
                }

                this.$el.html(template({
                    orders : context
                }));

                this._setupElements();

                return this;
            },

            deleteAll : function(){
                Repository.deleteAll({
                    data : null
                });
            },

            makeTrade : function() {
                this.addChild({
                        id: 'TradeModalWidget',
                        viewClass: TradeModalWidget,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getOrders()
                        }
                    });

                return false;
            }
        });
    }
);