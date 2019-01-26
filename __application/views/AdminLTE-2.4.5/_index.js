/*
Description: This is script for authenticating Simpipro Web Application
Author: Ahmad hertanto
Email: antho.firuze@gmail.com
File: js
*/
jQuery(function () {
	"use strict";
	
	/**
	* Serialize tag type form
	*
	* @param String type Output type of data 'json' or 'object'
	* @returns json/object
	*/
	jQuery.fn.serialize = function (type) {
		if (typeof (type) == 'undefined') type = 'object';
		type = type.toLowerCase();

		var o = {};
		// Exclude Select Element
		var a = this.find('[name]').not('select').serializeArray();
		var dom = jQuery(this);
		jQuery.each(a, function (i, v) {
			var value_before = dom.find('[name="' + v.name + '"]').data('before');

			v.value = (v.value == 'on') ? '1' : v.value;
			if (jQuery.trim(v.value) != jQuery.trim(value_before))
				o[v.name] = o[v.name] ? o[v.name] || v.value : v.value;
		});

		// Only Select Element
		var a = this.find('select').serializeArray();
		jQuery.each(a, function (i, v) {
			var value_before = dom.find('[name="' + v.name + '"]').data('before');

			if (o[v.name]) {
				o[v.name] += ',' + v.value;
			} else {
				if (jQuery.trim(v.value) != jQuery.trim(value_before)) {
					o[v.name] = v.value;
				}
			}
		});
		return (type == 'json') ? JSON.stringify(o) : o;
	};

	/**
	 * Populate Form <form> tag with value (object)
	 * & Additional states
	 * 
	 * @param json/object o
	 */
	jQuery.fn.populate = function (o) {
		var dom = jQuery(this);
		jQuery.each(o, function (i) {
			var el = dom.find('[name="' + i + '"]');
			if (el.length > 0) {
				if (el.hasClass('date')) {
					// console.log(o[i]);
					if (o[i])
						el.data('before', moment(o[i], 'YYYY-MM-DD').format('DD-MM-YYYY')).val(moment(o[i], 'YYYY-MM-DD').format('DD-MM-YYYY'));
				} else if (el.hasClass('selection')) {
					el.data('before', o[i]).val(o[i]);
				} else {
					el.data('before', o[i]).val(o[i]);
				}
			}
		});
		// Additional states
		jQuery.each(dom.find('input'), function (i, el) {
			var el = jQuery(el);
			if (el.attr('required')) {
				if (el.parent().find('label').length > 0) {
					if (el.parent().find('label span').length < 1) {
						el.parent().find('label').append(jQuery('<span style="color:red" />').html(' *'));
					}
				}
			}
		});
		jQuery.each(dom.find('select'), function (i, el) {
			var el = jQuery(el);
			if (el.attr('required')) {
				if (el.parent().find('label').length > 0) {
					if (el.parent().find('label span').length < 1) {
						el.parent().find('label').append(jQuery('<span style="color:red" />').html(' *'));
					}
				}
			}
		});
  };
  /**
   * Populate Selection <select> tag 
   * 
   * @param
   * @returns 
   */
	jQuery.fn.populateSelection = function () {
		var dom = jQuery(this);
		/**
		 * Init Select or Combobox Ajax
		 */
		jQuery.each(dom.find('select.selection'), function (i) {
			// console.log(jQuery(this).data('method'));
			var el = jQuery(this);
			var is_autoload = (typeof (el.data('autoload')) == 'undefined') || el.data('autoload') == true ? true : false;
			var method = el.data('method');
			var key = el.data('key');
			var val = el.data('val');
			if (!method || !key || !val)
				return true;
		
			var o;
			if (o = JSON.parse(db_get(method))) {
				if (! is_autoload)
					return false;

				PopulateSelectionDom(el, o);
				return true;
			}

			var token = JSON.parse(db_get('session')).token;
			var data_request = JSON.stringify({
				"id":Math.floor(Math.random()*1000)+1,
				"agent":"web","method":method,"token":token,"lang":lang,"params":{}
			});
			jQuery.ajax({ data:data_request, 
				success: function (data) {
					if (data.status) {
						db_store(method, JSON.stringify(data.result));
						if (! is_autoload)
							return false;

						PopulateSelectionDom(el, data.result);
					} else {
						console.log('fun::populateSelection : status=false, method=' + el.data('method') + ', ');
						console.log(data);
					}
				}
			});
		});
	};
	/**
	 * For populating <select> element 
	 * 
	 * @param {*} el 
	 * @param {*} o 
	 */
	function PopulateSelectionDom(el, o) {
		el.html('').append(jQuery('<option />').attr('value', '').html(''));
		jQuery.each(o, function (i, v) { el.append(jQuery('<option />').attr('value', String(v[el.data('key')])).html(v[el.data('val')])) });
	}
	/**
	 * Count array/object 
	 */
	function count(o){
		if (Array.isArray(o))
			return o.length;
		else 
			return Object.keys(o).length;
	}	
	/**
	 * Check is_empty 
	 * 
	 * @param {*} o Data type Array/Object
	 */
	function is_empty(o) {
		if (o == undefined) return true;

		if (Array.isArray(o)) 
			return (arr.length > 0) ? false : true;
		else
			return (Object.keys(o).length > 0) ? false : true;
	}
	/**
	 * Distinct Array of Paired Object (JSON) base on fields
	 * 
	 * @param {array} o 			Array of Paired Object (JSON)
	 * @param {array} fields 	Array of String
	 */
	function array_distinct(o, fields) {
		var uniq = [];
		jQuery.each(o, function(i, v){
			var tkey = [];
			jQuery.each(fields, function(j, k){ tkey.push(v[k]) });
			
			if (uniq.indexOf(tkey.join('_')) === -1)
					uniq.push(tkey.join('_'));
		});

		var result = [];
		jQuery.each(uniq, function(i, v){
			var row = [];
			jQuery.each(v.split('_'), function(j, k){ row[fields[j]] = k });
			result.push(row);
		});
		return result;
	}
	/**
	 * Filter Paired Object (JSON) Of Array [{"id":1},{"id":1},{"id":1}]
	 * 
	 * @param {array} o							Array of Paired Object (JSON)
	 * @param {string} field 				Name of Field or Key
	 * @param {string} searchTerm 	Value
	 */
	function array_filter(o, field, searchTerm) {
		return jQuery.grep(o, function(i) {	return (i[field] == searchTerm) });
	}
	/**
	* Store a new settings in the browser
	*
	* @param String name Name of the setting
	* @param String val Value of the setting
	* @returns void
	*/
	function db_store(name, val) {
		if (typeof (Storage) !== "undefined") {
			sessionStorage.setItem(name, val);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}
	/**
	* Get a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function db_get(name) {
		if (typeof (Storage) !== "undefined") {
			return sessionStorage.getItem(name);
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}
	/**
	* Remove a prestored setting
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function db_remove(name) {
		if (typeof (Storage) !== "undefined") {
			if (name)
				return sessionStorage.removeItem(name);
			else
				return sessionStorage.clear();
		} else {
			window.alert('Please use a modern browser to properly view this template!');
		}
	}
	/**
	* Generate random GUID
	*
	* 
	* @returns String the value of random guid
	*/
	var newGuid = function(){
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
	
	// =================================================================================
	// Variable Global
	// =================================================================================
	var uri       = URI(location.href);
	var uri_path  = URI(uri.origin()+uri.path());
	var lang      = 'id';
	// var lang      = URI.parseQuery(uri.query()).lang;
	// var page      = URI.parseQuery(uri.query()).page;
	var token;
	// var language = jQuery("#shelter_language").text() ? JSON.parse(jQuery("#shelter_language").text()) : '';
	// var language_sub = jQuery("#shelter_language_sub").text() ? JSON.parse(jQuery("#shelter_language_sub").text()) : '';
	// var repos_url = db_get('repos_url');

	var appcode   = db_get('appcode');
	var api_url   = db_get('api_url');
	var base_url  = db_get('base_url');
	var theme_url = db_get('theme_url');
	var repos_url = db_get('repos_url');
	if (uri.host() == 'localhost:8080')
		api_url = 'http://localhost:5050';
	
	// var lang = lang ? lang : 'id';
	// var page = page ? page : 'home';
	/**
	 * Set Default Ajax Setting
	 */
	jQuery.ajaxSetup({ url:api_url, method:'POST', async:true, dataType:'json' });
	jQuery( document ).ajaxError(function( event, request, settings ) {
		console.log("Error requesting page: " + settings.url);
		console.log("With data: " + settings.data);
  });
  /**
   * Check token, is token still valid?
   */
	function checkToken() {
		var data_request = { "id": Math.floor(Math.random()*1000)+1, "agent": "web","token": token,"lang": lang,"method": "auth.checkToken"	};
		jQuery.ajax({ data: JSON.stringify(data_request),
			success: function (data) {
				if (!data.status) {
					alert(data.message);
					UnLoginState();
				}
			}
		});
	}
	/**
	* For loading ajax page
	*
	* @param String name Name of of the setting
	* @returns String The value of the setting | null
	*/
	function LoadAjaxPage(curr_page) {
		// var curr_page = this.name;
		var content_url = URI(uri.origin()+uri.path()+'/getContent').search({"lang":lang, "page":curr_page});
		jQuery.ajax({ url:content_url, method:"GET", async:true, dataType:'json',
			success: function(data) {
				// console.log(data);
				if (data.status) {
					language_sub = data.language;
					console.log(language_sub);
					jQuery('div.page-titles h3').html(data.title);
					jQuery('div.content').html(data.content);
					jQuery(".carousel").carousel();
					
					page = curr_page;
					var new_url = uri_path.search({"lang":lang, "page":page});
					// history.pushState({}, '', new_url);
					history.replaceState({}, '', new_url);
					AutoSelectLeftNavbar();
					// Initialization();

				} else {
					alert(data.message);
				}
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				console.log(data);
				alert(message);
			}
		});
	}
	/**
	 * Goto Login Page, with first clear localstorage data
	 */
	function UnLoginState() {
		db_remove();
	}
	/**
	 * WINDOW EVENTS 
	 */
	jQuery(window).on('load', function(){ 
		if (! db_get('session')) {
      UnLoginState();
		} 
	});
	jQuery(window).on("resize", function () {
		jQuery(document).find('[id="balance-chart"]').each(function (e) {
			if (jQuery(this).attr('_echarts_instance_'))
				echarts.getInstanceById(jQuery(this).attr('_echarts_instance_')).resize();
		});
	});
	
	// ============================================================== 
	// Initial Procedure
	// ============================================================== 
	function Initialization() {
		populateRunnningText();
		loadDataPortfolio();
		checkMenu();
	}
	
	jQuery(function () { Initialization() });
	
	function checkMenu() {
		var el = jQuery(document).find('body').attr('class');
		console.log(el);
	}

	function populateRunnningText() {
		// check existing element container
		var el = jQuery(document).find('[id="_running_text"]');
		if (el.length < 1) return false;

		el.html("");
		
		var spaces1 = '&nbsp;';
		var spaces2 = '&nbsp;&nbsp;';
		var spaces_lg = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
		var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.running_text","params":{}}; 
		jQuery.ajax({ 
			data: JSON.stringify(data_request),
			success: function(data) {
				if (data.status) {
					var sub_container = jQuery('<ul />');
					jQuery.each(data.result, function(i, v){
						var dom = jQuery('<div />');
						var portfolio_name = ((i < 1)?'*'+spaces_lg+spaces_lg:'')+v.PortfolioNameShort+spaces2;
						var nav_per_unit = accounting.formatMoney(v.NAVPerUnit, 'IDR ', 2, ".", ",")+spaces2;
						var ytd = accounting.formatMoney(v.PortfolioReturn, '', 2, ".", ",")+'%'+spaces2;
						var benchmark = (v.BenchmarkReturn) ? accounting.formatMoney(v.BenchmarkReturn, '', 2, ".", ",")+'%'+spaces_lg:'-'+spaces_lg;
						dom.append( jQuery('<span id="_rt_portfolio_name" />').html(portfolio_name) );
						dom.append( jQuery('<span id="_rt_nav_per_unit" />').html(nav_per_unit) );
						dom.append( jQuery('<span id="_rt_ytd" />').html(ytd) );
						dom.append( jQuery('<span id="_rt_benchmark" />').html(benchmark) );
						el.append( jQuery('<li />').append(dom) );
					});
					// populateRunnningText2();
					el.webTicker({ startEmpty:false, hoverpause:true,	});
				} else {
					el.html('');
				}
			},
		});
	}
	
	// ============================================================== 
	// login
	// ============================================================== 
	jQuery(document).on('submit', '[id="form_login"]', function(e) {
		e.preventDefault();
		
		var params = jQuery(this).serialize();
    var data_request = { "id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"auth.login","params":params	}; 

		jQuery.ajax({ data: JSON.stringify(data_request),
			beforeSend: function(xhr) { jQuery(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
          db_store('session', JSON.stringify(data.result));
          LoginState();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	// ============================================================== 
	// forgot
	// ============================================================== 
	jQuery(document).on('submit', '#form_reset_pwd', function(e) {
		e.preventDefault();
		
		var params = jQuery(this).serialize();
		var data_request = {
			"id": Math.floor(Math.random()*1000)+1,
			"agent":"web","appcode":appcode,"lang":lang,"method":"auth.forgot_password_simple","params":params
		}; 
		// console.log("b:"+JSON.stringify(params)); return false;
		jQuery.ajax({ data: JSON.stringify(data_request),
			beforeSend: function(xhr) { jQuery(this).find('[type="submit"]').attr("disabled", "disabled"); },
			success: function(data) {
				// console.log(data);
				if (data.status) {
					// var url_to = uri_path.search({
						// "lang":lang, 
						// "state":"auth", 
						// "page":"login"
					// });
					// window.location = url_to;
					
					alert(data.message);
					jQuery(document).find("#form_reset_pwd").fadeOut();
					jQuery(document).find("#form_login").fadeIn();
				} else {
					alert(data.message);
				}
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			},
			error: function(data, status, errThrown) {
				if (data.status >= 500){
					var message = data.statusText;
				} else {
					var error = JSON.parse(data.responseText);
					var message = error.message;
				}
				alert(message);
				setTimeout(function(){ jQuery(this).find('[type="submit"]').removeAttr("disabled"); },1000);
			}
		});
	}); 
	
	jQuery(document).on('click', '[id="to-recover-cancel"]', function(e) {
		jQuery(document).find("#form_reset_pwd").fadeOut();
		jQuery(document).find("#form_login").fadeIn();
	}); 
	
	// ============================================================== 
	// register
	// ============================================================== 
	jQuery(document).on('click', '[id="register"]', function(e) {
		e.preventDefault();

		var url_to = uri.path('backend').search({
			"lang":lang, 
			"state":"auth", 
			"page":"register"
		});
		window.location = url_to;
	});
	
	// ============================================================== 
	// load data portfolio
	// ============================================================== 

	function loadDataPortfolio(){
		// check existing element container
		var el = jQuery(document).find('[id="_portfolio_list"]');
		if (el.length < 1) return false;

		get_data();

		function get_data() {
			var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.performance","params":{}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(el, data.result);
					} else {
						console.log('loadDataPortfolio: status:false', data);
					}
				},
			});
		}

		function set_data(dom, data) {
			jQuery.each(data, function(i){
				var id = newGuid();
				// var layout = jQuery(jQuery('#portfolio_performance_layout')[0].innerHTML);
				var layout = jQuery( 
				'   <div class="items-row cols-1 row-0">  '  + 
				'       <div class="span12">  '  + 
				'           <div class="item column-1">  '  + 
				'               <div class="wraptitle">  '  + 
				'                   <div class="page-header">  '  + 
				'                       <h2 id="_param_portfolio_name">Avrist Balance Cross Sectoral</h2>  '  + 
				'                   </div>  '  + 
				'               </div>  '  + 
				'               <div class="wrapcontent">  '  + 
				'                   <div class="wrapblogimg"><div class="wrapimg"><img id="_param_portfolio_image" src="<?=THEME_URL?>images/timbangan.png" /></div></div>  '  + 
				'                   <div class="wrapcontentinside">  '  + 
				'                       <div class="divWrap">  '  + 
				'                           <div class="column colNav">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <h3>NAV/Unit</h3>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_nav_per_unit" class="divCell">0.00</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div id="_param_position_date" class="divCell date">23 Aug 2018</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <div class="boxlevel">  '  + 
				'                                           <ul class="wraplevel">  '  + 
				'                                               <li id="_param_risk_score1"><span>1</span></li>  '  + 
				'                                               <li id="_param_risk_score2"><span>2</span></li>  '  + 
				'                                               <li id="_param_risk_score3"><span>3</span></li>  '  + 
				'                                               <li id="_param_risk_score4"><span>4</span></li>  '  + 
				'                                               <li id="_param_risk_score5"><span>5</span></li>  '  + 
				'                                           </ul>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-5">  '  + 
				'                                   <div class="divCell desclevel">  '  + 
				'                                       <div class="wrapdesclevel">  '  + 
				'                                           <span class="left">Konservatif</span>&nbsp;<span class="right">Agresif</span>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-6">  '  + 
				'                                   <div class="divCell">  '  + 
				'                                       <div class="readmore">  '  + 
				'                                           <a id="_param_btn_detail" class="btn" href="javascript:void(0)">  '  + 
				'                                               <span class="text">Lihat Detail</span>  '  + 
				'                                           </a>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colMTD">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell"><h3>MTD</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_mtd" class="divCell percent">3,96%</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell"><h3>1Y</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div id="_param_1y" class="divCell percent">11,58%</div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colYTD">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell"><h3>YTD</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_ytd" class="divCell percent">8,52%</div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell"><h3>2Y</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-4">  '  + 
				'                                   <div id="_param_2y" class="divCell percent">14,12%</div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="column colTujuan">  '  + 
				'                               <div class="item-row row-1">  '  + 
				'                                   <div class="divCell colinvest"><h3>Tujuan Investasi</h3></div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-2">  '  + 
				'                                   <div id="_param_investment_goal" class="divCell colinvest descinvest">Avrist Balance - Cross Sectoral (ABCS) bertujuan untuk memberikan keseimbangan  '  + 
				'                                       antara pertumbuhan nilai investasi dengan volatilitasnya, dengan berinvestasi pada efek bersifat ekuitas, efek surat utang,  '  + 
				'                                       dan instrumen uang di Indonesia.  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                               <div class="item-row row-3">  '  + 
				'                                   <div class="divCell colinvest">  '  + 
				'                                       <div class="colfee">  '  + 
				'                                           <span class="subscription">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Subscription Fee:</li>  '  + 
				'                                                   <li id="_param_subs_fee" class="percent">1%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <span class="redemption">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Redemption Fee:</li>  '  + 
				'                                                   <li id="_param_redeem_fee" class="percent">1%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <span class="switching">  '  + 
				'                                               <ul>  '  + 
				'                                                   <li class="label">Switching Fee:</li>  '  + 
				'                                                   <li id="_param_switching_fee" class="percent">0.5%</li>  '  + 
				'                                               </ul>  '  + 
				'                                           </span>  '  + 
				'                                           <div class="clean"></div>  '  + 
				'                                       </div>  '  + 
				'                                   </div>  '  + 
				'                               </div>  '  + 
				'                           </div>  '  + 
				'                           <div class="clean"></div>  '  + 
				'                       </div>  '  + 
				'                       <div class="clean"></div>  '  + 
				'                   </div>  '  + 
				'                   <div class="clean"></div>  '  + 
				'               </div>  '  + 
				'               <div class="clean"></div>  '  + 
				'           </div>  '  + 
				'           <div class="clean"></div>  '  + 
				'           <!-- end item -->   '  + 
				'       </div>  '  + 
				'       <!-- end span -->   '  + 
				'   </div>  '  + 
				'  <!-- end row -->  '
				);
				var img = repos_url+'/portfolio/'+data[i]['PortfolioCode']+'.png';
				layout.find('#_param_portfolio_name').html(data[i]['PortfolioNameShort']);
				layout.find('#_param_portfolio_image').attr('src', img);
				layout.find('#_param_portfolio_image').attr('title', data[i]['PortfolioNameShort']);
				// layout.attr('id', data[i]['simpiID']+'_'+data[i]['PortfolioID']);
				// layout.find('#asset_type').html(data[i]['AssetTypeCode']);
				// layout.find('a.view_detail').attr('href', '#'+id);
				// layout.find('a.view_detail').data('simpi_id', data[i]['simpiID']);
				// layout.find('a.view_detail').data('portfolio_id', data[i]['PortfolioID']);
				// layout.find('div.collapse').attr('id', id);
				
				layout.find('#_param_nav_per_unit').html(accounting.formatMoney(data[i]['NAVperUnit'], '', 2, ".", ","));
				layout.find('#_param_position_date').html(moment(data[i]['PositionDate']).format('DD MMM YYYY'));
				if (data[i]['RiskScore']) {
					var risk_score = data[i]['RiskScore'];
					for (var i=1; i <= risk_score; i++) {
						layout.find('#_param_risk_score'+i).attr('class', 'activelevel');
					}
				}
				
				layout.find('#_param_mtd').html(accounting.formatMoney(data[i]['rMTD']*100, '', 2, ".", ",")+'%');
				layout.find('#_param_ytd').html(accounting.formatMoney(data[i]['rYTD']*100, '', 2, ".", ",")+'%');
				layout.find('#_param_1y').html(accounting.formatMoney(data[i]['r1Y']*100, '', 2, ".", ",")+'%');
				layout.find('#_param_2y').html(accounting.formatMoney(data[i]['r2Y']*100, '', 2, ".", ",")+'%');
				
				layout.find('#_param_investment_goal').html(data[i]['InvestmentGoal']);
				layout.find('#_param_subs_fee').html(data[i]['SubsFee']);
				layout.find('#_param_redeem_fee').html(data[i]['RedeemFee']);
				layout.find('#_param_switching_fee').html(data[i]['SwitchingFee']);
				
				// if (data[i]['AssetTypeCode'].toUpperCase() == 'EQ') {
				// 	layout.find('.eq').show();
				// 	layout.find('.non-eq').hide();
				// } else {
				// 	layout.find('.eq').hide();
				// 	layout.find('.non-eq').show();
				// }
				layout.find('#_param_btn_detail').data('simpi_id', data[i]['simpiID']);
				layout.find('#_param_btn_detail').data('portfolio_id', data[i]['PortfolioID']);
				// layout.find('#_param_btn_detail').on('click', function(e){
				// 	alert(data[i]['PortfolioNameShort']);
				// });
	
				dom.append(layout);
			});
		}
	}
	
	jQuery(document).on('click', '#_param_btn_detail', function(e) {
		var simpi_id = jQuery(this).data('simpi_id');
		var portfolio_id = jQuery(this).data('portfolio_id');

		// alert(simpi_id + '-' + portfolio_id);
		var layout = jQuery(
			'<div id="_param_chart_nav"></div>' +
			'<div id="_param_chart_top_sector_eq"></div>' +
			'<div id="_param_chart_top_sector_eq"></div>'
		);
		// =======================
		// Performance Year To Date / Kinerja Sejak Awal Tahun / id="line-chart"
		// =======================
		populate_chart_nav(this, simpi_id, portfolio_id);

		// =======================
		// Top 5 Stock NAV / Efek dalam Portfolio (Top 5) / id="tablePortfolio"
		// =======================
		populate_top_stock_nav(simpi_id, portfolio_id, data.result);
		
		var asset_type = jQuery('#'+simpi_id+'_'+portfolio_id).find('#asset_type').html();
		if (asset_type.toUpperCase() == 'EQ') {

			// =======================
			// Sector EQ / Alokasi Sektor (Top 5) / id="doughnut-chart"
			// =======================
			populate_top_sector_eq(simpi_id, portfolio_id, data.result);
			
		} else {
			
			// =======================
			// Sector Non EQ / Asset Class / id="tableAssetClass"
			// =======================
			populate_top_sector_non_eq(simpi_id, portfolio_id, data.result);

		}
	});
	
	jQuery(window).on("resize", function() {
		jQuery(document).find('[id="line-chart"]').each(function(e){
			if (jQuery(this).attr('_echarts_instance_'))
				echarts.getInstanceById(jQuery(this).attr('_echarts_instance_')).resize();
		});
	});

	function populate_chart_nav(parent, simpi_id, portfolio_id) {
		// check existing element container
		// var el = jQuery(document).find('[id="_param_line_chart"]');
		// if (el.length < 1) return false;
		var id = simpi_id+'_'+portfolio_id;
		var el = '<div id="'+id+'" class="wrapcontent"></div>';
		jQuery(parent).closest('div.item').append(jQuery(el).html('yajdfjklasdklfj;klsdj;fkl'));
		return false;

		get_data();

		function get_data() {
			var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.chart_nav","params":{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(el, data.result);
					} else {
						console.log('loadDataLineChart: status:false', data);
					}
				},
			});
		}

		function set_data(el, data) {
			var x_axis = [], y_axis = [];
			jQuery.each(data, function(i){ 
				// y_axis.push(accounting.formatMoney(data[i].line1 * 100, '', 2, ".", ","));
				y_axis.push(data[i].line1 * 100);
				x_axis.push(moment(data[i].PositionDate).format('DD MMM YYYY'));
			});
			
			// var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#line-chart').html('');
			var dom = el.html('');
			var mytempChart = echarts.init(dom[0]);
			var option = {
					tooltip: { 
						trigger: 'axis', 
						formatter : function (params) {
								return params[0].name + ' : ' + accounting.formatMoney(params[0].value, '', 2, ".", ",") + ' %';
						}
					},
					
					// legend: { data: ['max temp', 'min temp'] },
					toolbox: {
						show: true,
						feature: {
								magicType: { show: true, type: ['line', 'bar'] },
								restore: { show: true },
								saveAsImage: { show: true }
						}
					},
					color: ["#55ce63", "#009efb"],
					calculable: true,
					xAxis: [{
						type: 'category',
						boundaryGap: false,
						data: x_axis
					}],
					yAxis: [{
						type: 'value',
						axisLabel: { formatter: '{value} %' }
					}],
					series: [{
						// name: 'max temp',
						type: 'line',
						color: ['#000'],
						data: y_axis,
						smooth: true,
						itemStyle: {
								normal: {
										areaStyle: {type: 'default'},
										lineStyle: {
												shadowColor: 'rgba(0,0,0,0.3)',
												shadowBlur: 10,
												shadowOffsetX: 8,
												shadowOffsetY: 8
										}
								}
						},
						markLine: {
								data: [
										{ type: 'average', name: 'Average' }
								]
						}
					}]
			};
			mytempChart.setOption(option, true);
		}
	}
	
	function populate_top_sector_eq(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.top_sector_eq","params":{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var data_legend = [], data_chart = [], sumPercent = 0;
			jQuery.each(o, function(i){ 
				sumPercent = sumPercent + (o[i].Percent * 100);
				data_legend.push(o[i].SectorName);
				data_chart.push({"value":o[i].Percent * 100, "name":o[i].SectorName});
			});
			// Add Others
			data_legend.push('OTHERS');
			data_chart.push({"value":(100 - sumPercent), "name":"OTHERS"});
	
			console.log(data_chart);
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html('');
			var mytempChart = echarts.init(dom[0]);
			var option = {
				tooltip: {
						trigger: 'item',
						formatter : function (params) {
							// console.log(params);
							return accounting.formatMoney(params[2], '', 2, ".", ",") + ' %';
						}
						// formatter: "{b} : {c}%"
				},
				color: ["#f62d51", "#009efb", "#55ce63", "#ffbc34", "#2f3d4a", "#6f42c1"],
				calculable: true,
				series: [{
						name: 'Source',
						type: 'pie',
						radius: ['50%', '70%'],
						data: data_chart
				}]
			};
			mytempChart.setOption(option, true);
		}
	}
	
	function populate_top_sector_non_eq(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.top_sector_non_eq","params":{"simpi_id":simpi_id,"portfolio_id":portfolio_id}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#doughnut-chart').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#tableAssetClass');
			dom.html('');
			var tbl_class = dom.attr('class');
			
			var container = jQuery('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
					table = container.find('table'),
					thead = container.find('thead'),
					tbody = container.find('tbody');
					
			// TABLE DETAIL
			if (o) {
				var sumPercent = 0;
				jQuery.each(o, function(i){
					var tr = jQuery('<tr />');
					jQuery.each(o[i], function(j){
						if (j=='Percent') {
							sumPercent = sumPercent + (o[i][j]*100);
							tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
						} else	
							tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
					});
					tr.appendTo(tbody);
				});
				
				// Add Liquidity
				var tr = jQuery('<tr />');
				tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html('LIQUIDITY') );
				tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(100-sumPercent, '', 2, ".", ",")+' %') );
				tr.appendTo(tbody);
	
				dom.append(container);
			} else {
				dom.html('Record not found');
			}
		}
	}
	
	function populate_top_stock_nav(simpi_id, portfolio_id, o) {
		get_data();

		function get_data() {
			var data_request = {"id": Math.floor(Math.random()*1000)+1,"agent":"web","appcode":appcode,"lang":lang,"method":"portfolio.top_stock_nav","params":{"simpi_id":simpi_id, "portfolio_id":portfolio_id, "fields":"SecuritiesNameShort,TypeDescription,Percent"}}; 
			jQuery.ajax({ data: JSON.stringify(data_request),
				success: function(data) {
					// console.log(data);
					if (data.status) {
						set_data(simpi_id, portfolio_id, data.result);
					} else {
						jQuery('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html(data.message);
					}
				},
			});
		}

		function set_data(simpi_id, portfolio_id, data) {
			var dom = jQuery('#'+simpi_id+'_'+portfolio_id).find('#tablePortfolio').html('');
			var tbl_class = dom.attr('class');
			
			var container = jQuery('<div class="'+tbl_class+'"><table class="table" style="margin-bottom:0px;"><thead></thead><tbody></tbody></table></div>'),
					table = container.find('table'),
					thead = container.find('thead'),
					tbody = container.find('tbody');
			
			// TABLE HEADER
			// if (o.showheader){
				// var tr = jQuery('<tr />');
				// jQuery.each(o.columns, function(j){
					// if (c==1){ if (o.rowno){ tr.append( jQuery('<th />').html('#') ); } }
					// tr.append( jQuery('<th />').html(o.columns[j]['title']) );
					// c++;
				// });
				// tr.appendTo(thead);
			// }
			// var o = [
				// { name: "Obligasi Pemerintah", category: "Obligasi", percent: "31.00" },
				// { name: "Astra International", category: "Saham", percent: "6.00" },
				// { name: "Bank Central Asia", category: "Saham", percent: "6.00" },
				// { name: "PT. BRI (Persero)", category: "Saham", percent: "5.00" },
				// { name: "Bank Mandiri (Persero)", category: "Saham", percent: "5.00" },
			// ];
	
			// TABLE DETAIL
			if (o) {
				jQuery.each(o, function(i){
					var tr = jQuery('<tr />');
					jQuery.each(o[i], function(j){
						if (j=='Percent')
							tr.append( jQuery('<td style="padding:0px; font-size:12px; text-align:right; white-space:nowrap;" />').html(accounting.formatMoney(o[i][j]*100, '', 2, ".", ",")+' %') );
						else	
							tr.append( jQuery('<td style="padding:0px; font-size:12px;" />').html(o[i][j]) );
					});
					tr.appendTo(tbody);
				});
				dom.append(container);
			} else {
				dom.html('Record not found');
			}
		}
	}
	
});