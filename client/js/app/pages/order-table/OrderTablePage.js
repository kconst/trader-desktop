/**
 * Copyright 2013 Archfirst
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * app/pages/order-table/OrderTablePage
 *
 * @author Naresh Bhatia
 */
define(
    [
        'app/domain/Repository',
        'app/widgets/orderTable/OrderTableWidget',
        'app/widgets/header/HeaderWidget',
        'keel/BaseView',
        'text!app/pages/order-table/OrderTablePageTemplate.html'
    ],
    function(Repository, OrderTableWidget, HeaderWidget, BaseView, OrderTablePageTemplate) {
        'use strict';

        return BaseView.extend({
            tagName: 'section',
            id: 'order-table-page',

            template: {
                name: 'OrderTablePageTemplate',
                source: OrderTablePageTemplate
            },

            postRender: function() {
                this.addChildren([
                    {
                        id: 'HeaderWidget',
                        viewClass: HeaderWidget,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getloggedInUser()
                        }
                    },
                    {
                        id: 'OrderTableWidget',
                        viewClass: OrderTableWidget,
                        parentElement: this.$el,
                        options: {
                            collection: Repository.getOrders()
                        }
                    }
                ]);
            }
        });
    }
);