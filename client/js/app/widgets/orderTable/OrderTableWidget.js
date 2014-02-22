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
//                var loggedInUserId = this.userSelectorElement.val();
//                Repository.setloggedInUser(loggedInUserId);

//                Backbone.history.navigate('order-table', true);
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