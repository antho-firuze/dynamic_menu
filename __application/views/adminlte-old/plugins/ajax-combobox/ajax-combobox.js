/**
 * @file jQuery Plugin: jquery.ajax-combobox
 * @version 7.4.4
 * @author Yuusaku Miyazaki <toumin.m7@gmail.com>
 * @license MIT License
 */
(function($) {

/**
 * @desc ??????jQuery????????????
 * @global
 * @memberof jQuery
 * @param {string|Object} source - ????????????????????????
 * @param {Object} option - ??????????????
 * @param {boolean} [option.instance] - ?????????????jQuery???????????????????????
 * @param {string} [option.lang='ja'] - ??????????????????? ('ja', 'en', 'es' and 'pt-br')
 * @param {string} [option.db_table='tbl'] - ??????????????????
 * @param {string} [option.field='name'] - JavaScript?????????????????
 * @param {string} [option.search_field=option.field] - ?????????????????????????? (e.g.: 'id, name, job')
 * @param {string|Array} [option.order_by=option.search_field] - ???????????????????? (e.g.: 'name DESC' or ['name ASC', 'age DESC'])
 * @param {number} [option.per_page=10] - ?????1?????????????
 * @param {number} [option.navi_num=5] - ???????????????????
 * @param {boolean} [option.navi_simple=false] - ??�???????????????????ComboBox?????????????
 * @param {string} [option.plugin_type='combobox'] - 'combobox', 'simple', 'textarea'
 * @param {string} [option.init_record=false] - ???????????????????????????? 
 * @param {string} [option.bind_to] - ??????????????????
 * @param {string} [option.and_or='AND'] - AND???????OR?? ('AND' or 'OR')
 * @param {boolean|string} [option.sub_info=false] - ????????'simple'???????????????????? (true, false or 'simple')
 * @param {Objec} [option.sub_as={}] - ????????????????????????
 * @param {string} [option.show_field] - ????????????????????????????? (e.g.: 'id' or 'id, job, age')
 * @param {string} [option.hide_field] - ??????????????????????????????? (e.g.: 'id' or 'id, job, age')
 * @param {boolean} [option.select_only=false] - ??????????(?????????????????????)
 * @param {string} [option.primary_key='id'] - ????????Form ? hidden ?????????????????????????
 * @param {string} [option.button_img='dist/btn.png'] - ??????????
 * @param {string} [option.shorten_btn] - (option.plugin_type='textarea' ???????)?????????????
 * @param {string} [option.shorten_src='dist/bitly.php'] - URL???????????????????
 * @param {number} [option.shorten_min=20] - URL??????????????
 * @param {Object} [option.shorten_reg] - URL?????????????
 * @param {Array} [option.tags=false] - (option.plugin_type='textarea' ???????)????????
 * @param {Array} [option.tags.pattern] - ?????????????????????????? (e.g.: pattern: [ '<', '>' ])
 * @param {Array} [option.tags.space] - ??????????????????????????????
 * @param {string} [option.tags.db_table=option.db_table]
 * @param {string} [option.tags.field=option.field]
 * @param {string} [option.tags.search_field=option.search_field]
 * @param {string|Array} [option.tags.order_by=option.order_by]
 * @param {boolean|string} [option.tags.sub_info=option.sub_info]
 * @param {Object} [option.tags.sub_as=option.sub_as]
 * @param {string} [option.tags.show_field=option.show_field]
 * @param {string} [option.tags.hide_field=option.hide_field]
 */
$.fn.ajaxComboBox = function(source, option) {
  var arr = [];
  this.each(function() {
    arr.push(new AjaxComboBox(this, source, option));
  });
  return (option !== undefined && option.instance !== undefined && option.instance) ? $(arr) : this;
};

/**
 * @global
 * @constructor
 * @classdesc ???????????????????
 * @param {Object} combo_input - ??????????HTML???
 * @param {string|Object} source - ????????????????????????
 * @param {Object} option - ??????????????
 */
function AjaxComboBox(combo_input, source, option) {
  this._setOption(source, option);
  this._setMessage();
  this._setCssClass();
  this._setProp();
  this._setElem(combo_input);

  this._setButtonAttrDefault();
  this._setInitRecord();

  this._ehButton();
  this._ehComboInput();
  this._ehWhole();
  this._ehTextArea();

  if (this.option.shorten_btn) this._findUrlToShorten(this);
}

$.extend(AjaxComboBox.prototype, /** @lends AjaxComboBox.prototype */ {
  /**
   * @private
   * @desc ?????????
   * @param {string|Object} source - ????????????????????????????
   * @param {Object} option - ?????????????
   */
  _setOption: function(source, option) {
    option = this._setOption1st(source, option);
    option = this._setOption2nd(option);
    this.option = option;
  },

  /**
   * @private
   * @desc ????????? ?1??
   * @param {string|Object} source - ????????????????????????????
   * @param {Object} option - ?????????????
   * @return {Object} - ?1????????????
   */
  _setOption1st: function(source, option) {
    return $.extend({
      // ????
      source: source,
      lang: 'ja',
      plugin_type: 'combobox',
      init_record: false,
      db_table: 'tbl',
      field: 'name',
      and_or: 'AND',
      per_page: 10,
      navi_num: 5,
      primary_key: 'id',
      button_img: 'dist/btn.png',
      bind_to: false,
      navi_simple: false,

      // ????
      sub_info: false,
      sub_as: {},
      show_field: '',
      hide_field: '',

      // ??????
      select_only: false,

      // ????
      tags: false,

      // URL???
      shorten_btn: false, // ????????????
      shorten_src: 'dist/bitly.php',
      shorten_min: 20,
      shorten_reg: false
    }, option);
  },

  /**
   * @private
   * @desc ????????? ?2??
   * @param {Object} option - ?????????????
   * @return {Object} - ?2????????????
   */
  _setOption2nd: function(option) {
    // ?????????(?????????????)
    option.search_field = (option.search_field === undefined) ?
      option.field :
      option.search_field;

    // ??????
    option.and_or = option.and_or.toUpperCase();

    // ?????????????????????
    var arr = ['hide_field', 'show_field', 'search_field'];
    for (var i=0; i<arr.length; i++) {
      option[arr[i]] = this._strToArray(option[arr[i]]);
    }

    // CASE WHEN??ORDER BY??
    option.order_by = (option.order_by === undefined) ?
      option.search_field :
      option.order_by;

    // order_by ??????
    // ?:  [ ['id', 'ASC'], ['name', 'DESC'] ]
    option.order_by = this._setOrderbyOption(option.order_by, option.field);

    // ???????
    if (option.plugin_type == 'textarea') {
      option.shorten_reg = this._setRegExpShort(option.shorten_reg, option.shorten_min);
    }

    // ??????
    if (option.tags) {
      option.tags = this._setTagPattern(option);
    }
    return option;
  },

  /**
   * @private
   * @desc ?????????????????
   * @param {string} str - ???
   * @return {Array} - ??
   */
  _strToArray: function(str) {
    return str.replace(/[\s ]+/g, '').split(',');
  },

  /**
   * @private
   * @desc URL?????URL???????????????????????
   * @param {Object|boolean} shorten_reg - ???????????????????????false
   * @return {Object} - ??????????
   */
  _setRegExpShort: function(shorten_reg, shorten_min) {
    if (shorten_reg) return shorten_reg; // ????????????????????????
    var reg = '(?:^|[\\s| \\[(<??(?[<<�]+)';
    reg += '(';
    reg += 'https:\\/\\/[^\\s| \\])>??)?]>>�]{' + (shorten_min - 7) + ',}';
    reg += '|';
    reg += 'http:\\/\\/[^\\s| \\])>??)?]>>�]{'  + (shorten_min - 6) + ',}';
    reg += '|';
    reg += 'ftp:\\/\\/[^\\s| \\])>??)?]>>�]{'   + (shorten_min - 5) + ',}';
    reg += ')';
    return new RegExp(reg, 'g');
  },

  /**
   * @private
   * @desc ?????????????????
   * @param {Object} option - ????????????
   * @return {Object} - ?????????????
   */
  _setTagPattern: function(option) {
    for (var i = 0; i < option.tags.length; i++) {
      option.tags[i] = this._setTagOptions(option, i);
      option.tags[i].pattern = this._setRegExpTag(option.tags[i].pattern, option.tags[i].space);
    }
    return option.tags;
  },

  /**
   * @private
   * @desc ?????????????
   * @param {Object} option - ????????????
   * @param {number} idx - ???????????
   * @return {Object} - ??1?????????????
   */
  _setTagOptions: function(option, idx) {
    option.tags[idx] = $.extend({
      // ??????
      space: [true, true],
      
      // DB??
      db_table: option.db_table,
      field: option.field,
      search_field: option.search_field,
      primary_key: option.primary_key,

      // ????
      sub_info: option.sub_info,
      sub_as: option.sub_as,
      show_field: option.show_field,
      hide_field: option.hide_field
    }, option.tags[idx]);

    // ?????????????????????
    var arr = ['hide_field', 'show_field', 'search_field'];
    for (var i = 0; i < arr.length; i++) {
      if (typeof option.tags[idx][arr[i]] != 'object') {
        option.tags[idx][arr[i]] = this._strToArray(option.tags[idx][arr[i]]);
      }
    }

    // order_by??????
    option.tags[idx].order_by = (option.tags[idx].order_by === undefined) ?
      option.order_by :
      this._setOrderbyOption(option.tags[idx].order_by, option.tags[idx].field);

    return option.tags[idx];
  },

  /**
   * @private
   * @desc ???????????????????????
   * @param {Array} pattern - ????????????????
   * @param {Array} space - ???????????????
   * @return {Object} - ??????????????
   */
  _setRegExpTag: function(pattern, space) {
    // ??????????????????
    var esc_left  = pattern[0].replace(/[\s\S]*/, this._escapeForReg);
    var esc_right = pattern[1].replace(/[\s\S]*/, this._escapeForReg);

    return {
      // ???????
      left: pattern[0],
      right: pattern[1],

      // ??????????????????????????
      reg_left: new RegExp(esc_left + '((?:(?!' + esc_left + '|' + esc_right + ')[^\\s ])*)$'),

      // ??????????????????????????
      reg_right: new RegExp('^((?:(?!' + esc_left + '|' + esc_right + ')[^\\s ])+)'),

      // ???????????????????????????????????
      // ???????????????????????
      space_left: new RegExp('^' + esc_left + '$|[\\s ]+' + esc_left + '$'),

      // ???????????????????????????????????
      // ???????????????????????
      space_right: new RegExp('^$|^[\\s ]+'),

      // ?????????????????????????????
      comp_right: new RegExp('^' + esc_right)
    };
  },

  /**
   * @private
   * @desc ????????????????
   * @param {string} text - ??????????
   * @return {string} - ?????
   */
  _escapeForReg: function(text) {
    return '\\u' + (0x10000 + text.charCodeAt(0)).toString(16).slice(1);
  },

  /**
   * @private
   * @desc ?????????????? order_by ??????
   * @param {Array} arg_order - ORDER BY ??????????
   * @param {string} arg_field - ??????????
   * @return {Array} - order_by ???
   */
  _setOrderbyOption: function(arg_order, arg_field) {
    var arr = [];
    var orders = [];
    if (typeof arg_order == 'object') {
      for (var i = 0; i < arg_order.length; i++) {
        orders = $.trim(arg_order[i]).split(' ');
        arr[i] =  (orders.length == 2) ? orders : [orders[0], 'ASC'];
      }
    } else {
      orders = $.trim(arg_order).split(' ');
      arr[0] = (orders.length == 2) ?
        orders :
        (orders[0].match(/^(ASC|DESC)$/i)) ?
          [arg_field, orders[0]] :
          [orders[0], 'ASC'];
    }
    return arr;
  },

  /**
   * @private
   * @desc ????????????????????
   */
  _setMessage: function() {
    var message;
    switch (this.option.lang) {
      // German (Thanks Sebastian Gohres)
      case 'de':
        message = {
          add_btn     : 'Hinzuf�gen-Button',
          add_title   : 'Box hinzuf�gen',
          del_btn     : 'L�schen-Button',
          del_title   : 'Box l�schen',
          next        : 'N�chsten',
          next_title  : 'N�chsten' + this.option.per_page + ' (Pfeil-rechts)',
          prev        : 'Vorherigen',
          prev_title  : 'Vorherigen' + this.option.per_page + ' (Pfeil-links)',
          first_title : 'Ersten (Umschalt + Pfeil-links)',
          last_title  : 'Letzten (Umschalt + Pfeil-rechts)',
          get_all_btn : 'alle (Pfeil-runter)',
          get_all_alt : '(Button)',
          close_btn   : 'Schlie�en (Tab)',
          close_alt   : '(Button)',
          loading     : 'lade...',
          loading_alt : '(lade)',
          page_info   : 'num_page_top - num_page_end von cnt_whole',
          select_ng   : 'Achtung: Bitte w�hlen Sie aus der Liste aus.',
          select_ok   : 'OK : Richtig ausgew�hlt.',
          not_found   : 'nicht gefunden',
          ajax_error  : 'Bei der Verbindung zum Server ist ein Fehler aufgetreten. (ajax-combobox)'
        };
        break;

      // English
      case 'en':
        message = {
          add_btn     : 'Add button',
          add_title   : 'add a box',
          del_btn     : 'Del button',
          del_title   : 'delete a box',
          next        : 'Next',
          next_title  : 'Next' + this.option.per_page + ' (Right key)',
          prev        : 'Prev',
          prev_title  : 'Prev' + this.option.per_page + ' (Left key)',
          first_title : 'First (Shift + Left key)',
          last_title  : 'Last (Shift + Right key)',
          get_all_btn : 'Get All (Down key)',
          get_all_alt : '(button)',
          close_btn   : 'Close (Tab key)',
          close_alt   : '(button)',
          loading     : 'loading...',
          loading_alt : '(loading)',
          page_info   : 'num_page_top - num_page_end of cnt_whole',
          select_ng   : 'Attention : Please choose from among the list.',
          select_ok   : 'OK : Correctly selected.',
          not_found   : 'not found',
          ajax_error  : 'An error occurred while connecting to server. (ajax-combobox)'
        };
        break;

      // Spanish (Thanks Joaquin G. de la Zerda)
      case 'es':
        message = {
          add_btn     : 'Agregar boton',
          add_title   : 'Agregar una opcion',
          del_btn     : 'Borrar boton',
          del_title   : 'Borrar una opcion',
          next        : 'Siguiente',
          next_title  : 'Proximas ' + this.option.per_page + ' (tecla derecha)',
          prev        : 'Anterior',
          prev_title  : 'Anteriores ' + this.option.per_page + ' (tecla izquierda)',
          first_title : 'Primera (Shift + Left)',
          last_title  : 'Ultima (Shift + Right)',
          get_all_btn : 'Ver todos (tecla abajo)',
          get_all_alt : '(boton)',
          close_btn   : 'Cerrar (tecla TAB)',
          close_alt   : '(boton)',
          loading     : 'Cargando...',
          loading_alt : '(Cargando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Atencion: Elija una opcion de la lista.',
          select_ok   : 'OK: Correctamente seleccionado.',
          not_found   : 'no encuentre',
          ajax_error  : 'Un error ocurri� mientras conectando al servidor. (ajax-combobox)'
        };
        break;

      // Brazilian Portuguese (Thanks Marcio de Souza)
      case 'pt-br':
        message = {
          add_btn     : 'Adicionar bot�o',
          add_title   : 'Adicionar uma caixa',
          del_btn     : 'Apagar bot�o',
          del_title   : 'Apagar uma caixa',
          next        : 'Pr�xima',
          next_title  : 'Pr�xima ' + this.option.per_page + ' (tecla direita)',
          prev        : 'Anterior',
          prev_title  : 'Anterior ' + this.option.per_page + ' (tecla esquerda)',
          first_title : 'Primeira (Shift + Left)',
          last_title  : '�ltima (Shift + Right)',
          get_all_btn : 'Ver todos (Seta para baixo)',
          get_all_alt : '(bot�o)',
          close_btn   : 'Fechar (tecla TAB)',
          close_alt   : '(bot�o)',
          loading     : 'Carregando...',
          loading_alt : '(Carregando)',
          page_info   : 'num_page_top - num_page_end de cnt_whole',
          select_ng   : 'Aten��o: Escolha uma op��o da lista.',
          select_ok   : 'OK: Selecionado Corretamente.',
          not_found   : 'n�o encontrado',
          ajax_error  : 'Um erro aconteceu enquanto conectando a servidor. (ajax-combobox)'
        };
        break;

      // Japanese (ja)
      default:
        message = {
          add_btn     : '?????',
          add_title   : '????????????',
          del_btn     : '?????',
          del_title   : '????????????',
          next        : '??',
          next_title  : '??' + this.option.per_page + '? (???)',
          prev        : '??',
          prev_title  : '??' + this.option.per_page + '? (???)',
          first_title : '??????? (Shift + ???)',
          last_title  : '??????? (Shift + ???)',
          get_all_btn : '???? (???)',
          get_all_alt : '??:???',
          close_btn   : '??? (Tab??)',
          close_alt   : '??:???',
          loading     : '?????...',
          loading_alt : '??:?????...',
          page_info   : 'num_page_top - num_page_end ? (? cnt_whole ?)',
          select_ng   : '?? : ???????????????',
          select_ok   : 'OK : ???????????',
          not_found   : '(0 ?)',
          ajax_error  : '???????????????????(ajax-combobox)'
        };
    }
    this.message = message;
  },

  /**
   * @private
   * @desc CSS???????????
   */
  _setCssClass: function() {
    // ??????
    var css_class = {
      container      : 'ac_container', // ComboBox???div??
      container_open : 'ac_container_open',
      selected       : 'ac_selected',
      re_area        : 'ac_result_area', // ??????<div>
      navi           : 'ac_navi', // ????????<div>
      results        : 'ac_results', // ???????<ul>
      re_off         : 'ac_results_off', // ????(?????)
      select         : 'ac_over', // ????<li>
      sub_info       : 'ac_subinfo', // ????
      select_ok      : 'ac_select_ok',
      select_ng      : 'ac_select_ng',
      input_off      : 'ac_input_off' // ?????
    };
    switch (this.option.plugin_type) {
      case 'combobox':
        css_class = $.extend(css_class, {
          button  : 'ac_button', // ????CSS???
          btn_on  : 'ac_btn_on', // ???(mover?)
          btn_out : 'ac_btn_out', // ???(mout?)
          input   : 'ac_input' // ????????
        });
        break;

      case 'simple':
        css_class = $.extend(css_class, {
          input: 'ac_s_input' // ????????
        });
        break;

      case 'textarea':
        css_class = $.extend(css_class, {
          input         : 'ac_textarea', // ????????
          btn_short_off : 'ac_btn_short_off'
        });
        break;
    }
    this.css_class = css_class;
  },

  /**
   * @private
   * @desc ???????????????????
   */
  _setProp: function() {
    this.prop = {
      timer_valchange: false, // ??????(????????????????)
      is_suggest: false, // ????????false=>?? / true=>??
      page_all: 1,  // ????????????????
      page_suggest: 1, // ????????????????
      max_all: 1,  // ?????????????
      max_suggest: 1, // ?????????????
      is_paging: false, // ???????
      is_loading: false, // Ajax????????????
      reserve_btn: false, // ????????????????????
      reserve_click: false, // ?????????????????????mousedown???
      xhr: false, // XMLHttp?????????
      key_paging: false, // ????????????
      key_select: false, // ????????????
      prev_value: '', // ???

      // ????
      size_navi: null, // ???????(????????)
      size_results: null, // ???????(???????)
      size_li: null, // ???????(????????)
      size_left: null, // ???????(??????)
      
      // ????
      tag: null
    };
  },

  /**
   * @private
   * @desc HTML??????????
   * @param {Object} combo_input - ??????????????HTML??
   */
  _setElem: function(combo_input) {
    // 1. ??????????
    // ??
    var elem = {};
    elem.combo_input = $(combo_input)
      .attr('autocomplete', 'off')
      .addClass(this.css_class.input)
      .wrap('<div>'); // This "div" is "container".

    elem.container = $(elem.combo_input).parent().addClass(this.css_class.container);
    if (this.option.plugin_type == 'combobox') {
      elem.button = $('<div>').addClass(this.css_class.button);
      elem.img    = $('<img>').attr('src', this.option.button_img);
    } else {
      elem.button = false;
      elem.img    = false;
    }
    // ????????
    elem.result_area = $('<div>').addClass(this.css_class.re_area);
    elem.navi        = $('<div>').addClass(this.css_class.navi);
    elem.navi_info   = $('<div>').addClass('info');
    elem.navi_p      = $('<p>');
    elem.results     = $('<ul>' ).addClass(this.css_class.results);
    elem.sub_info    = $('<div>').addClass(this.css_class.sub_info);
    // primary_key?????????????"input:hidden"???
    if (this.option.plugin_type == 'textarea') {
      elem.hidden = false;
    } else {
      var hidden_name = ($(elem.combo_input).attr('name') !== undefined) ?
        $(elem.combo_input).attr('name') :
        $(elem.combo_input).attr('id');
      // CakePHP???? ?:data[search][user] -> data[search][user_primary_key]
      if (hidden_name.match(/\]$/)) {
        hidden_name = hidden_name.replace(/\]?$/, '_primary_key]');
      } else {
        hidden_name += '_primary_key';
      }
      elem.hidden = $('<input type="hidden" />')
        .attr({
          name: hidden_name,
          id: hidden_name
        })
        .val('');
    }

    // 2. ???HTML??????
    switch (this.option.plugin_type) {
      case 'combobox':
        $(elem.container)
          .append(elem.button)
          .append(elem.result_area)
          .append(elem.hidden);
        $(elem.button).append(elem.img);
        break;
      
      case 'simple':
        $(elem.container)
          .append(elem.result_area)
          .append(elem.hidden);
        break;
      
      case 'textarea':
        $(elem.container)
          .append(elem.result_area);
    }
    $(elem.result_area)
      .append(elem.navi)
      .append(elem.results)
      .append(elem.sub_info);
    $(elem.navi)
      .append(elem.navi_info)
      .append(elem.navi_p);

    // 3. ?????
    // ComboBox??
    if (this.option.plugin_type == 'combobox') {
      $(elem.container).width($(elem.combo_input).outerWidth() + $(elem.button).outerWidth());
    } else {
      $(elem.container).width($(elem.combo_input).outerWidth());
    }

    this.elem = elem;
  },

  /**
   * @private
   * @desc ?????????????
   */
  _setButtonAttrDefault: function() {
    if (this.option.select_only) {
      if ($(this.elem.combo_input).val() !== '') {
        if (this.option.plugin_type != 'textarea') {
          if ($(this.elem.hidden).val() !== '') {
            // ????
            $(this.elem.combo_input)
              .attr('title',this.message.select_ok)
              .removeClass(this.css_class.select_ng)
              .addClass(this.css_class.select_ok);
          } else {
            // ????
            $(this.elem.combo_input)
              .attr('title',this.message.select_ng)
              .removeClass(this.css_class.select_ok)
              .addClass(this.css_class.select_ng);
          }
        }
      } else {
        // ??????????
        if (this.option.plugin_type != 'textarea') $(this.elem.hidden).val('');
        $(this.elem.combo_input)
          .removeAttr('title')
          .removeClass(this.css_class.select_ng);
      }
    }
    if (this.option.plugin_type == 'combobox') {
      $(this.elem.button).attr('title', this.message.get_all_btn);
      $(this.elem.img).attr('src', this.option.button_img);
    }
  },

  /**
   * @private
   * @desc ComboBox?????????
   */
  _setInitRecord: function() {
    if (this.option.init_record === false) return;
    // ??????????????
    // hidden?????
    if (this.option.plugin_type != 'textarea') $(this.elem.hidden).val(this.option.init_record);

    // ?????????????
    if (typeof this.option.source == 'object') {
      // source??????????
      var data;
      for (var i = 0; i < this.option.source.length; i++) {
        if (this.option.source[i][this.option.primary_key] == this.option.init_record) {
          data = this.option.source[i];
          break;
        }
      }
      this._afterInit(this, data);
    } else {
      var self = this;
      $.ajax({
        dataType: 'json',
        url: self.option.source,
        data: {
          db_table: this.option.db_table,
          pkey_name: this.option.primary_key,
          pkey_val: this.option.init_record
        },
        success: function (json) {
          self._afterInit(self, json);
        },
        error: function(jqXHR, textStatus, errorThrown) { self._ajaxErrorNotify(self, errorThrown); }
      });
    }
  },

  /**
   * @private
   * @desc ????Ajax??????
   * @param {Object} self - ??????????????????
   * @param {Object} data - ???????????
   */
  _afterInit: function(self, data) {
    $(self.elem.combo_input).val(data[self.option.field]);
    if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val(data[self.option.primary_key]);
    self.prop.prev_value = data[self.option.field];
    if (self.option.select_only) {
      // ????
      $(self.elem.combo_input)
        .attr('title',self.message.select_ok)
        .removeClass(self.css_class.select_ng)
        .addClass(self.css_class.select_ok);
    }
  },

  /**
   * @private
   * @desc ????????: ???
   */
  _ehButton: function() {
    if (this.option.plugin_type != 'combobox') return;

    var self = this;
    $(self.elem.button)
      .mouseup(function(ev) {
        if ($(self.elem.result_area).is(':hidden')) {
          clearInterval(self.prop.timer_valchange);
          self.prop.is_suggest = false;
          self._suggest(self);
          $(self.elem.combo_input).focus();
        } else {
          self._hideResults(self);
        }
        ev.stopPropagation();
      })
      .mouseover(function() {
        $(self.elem.button)
          .addClass(self.css_class.btn_on)
          .removeClass(self.css_class.btn_out);
      })
      .mouseout(function() {
        $(self.elem.button)
          .addClass(self.css_class.btn_out)
          .removeClass(self.css_class.btn_on);
      }).mouseout(); // default: mouseout
  },

  /**
   * @private
   * @desc ????????: ???????????
   */
  _ehComboInput: function() {
    var self = this;
    $(self.elem.combo_input).keydown(function(ev) {
      self._processKey(self, ev);
    });
    $(self.elem.combo_input)
      .focus(function() {
        self._setTimerCheckValue(self);
      })
      .click(function() {
        self._setCssFocusedInput(self);
        $(self.elem.results).children('li').removeClass(self.css_class.select);
      });
  },

  /**
   * @private
   * @desc ????????: ?????????
   */
  _ehWhole: function() {
    var self = this;
    var stop_hide = false; // ???????????????????????????????????
    $(self.elem.container).mousedown(function() {
      stop_hide = true;
    });
    $('html').mousedown(function() {
      if (stop_hide) stop_hide = false;
      else           self._hideResults(self);
    });
  },

  /**
   * @private
   * @desc ????????: ???????
   */
  _ehResults: function() {
    var self = this;
    $(self.elem.results)
      .children('li')
      .mouseover(function() {
        // Firefox????????????????????????
        // ???????????????????? ???????
        if (self.prop.key_select) {
          self.prop.key_select = false;
          return;
        }
        self._setSubInfo(self, this);

        $(self.elem.results).children('li').removeClass(self.css_class.select);
        $(this).addClass(self.css_class.select);
        self._setCssFocusedResults(self);
      })
      .click(function(e) {
        // Firefox????????????????????????
        // ???????????????????????????
        if (self.prop.key_select) {
          self.prop.key_select = false;
          return;
        }
        e.preventDefault();
        e.stopPropagation();
        self._selectCurrentLine(self, false);
      });
  },

  /**
   * @private
   * @desc ????????: ???????
   * @param {Object} self - ??????????????????????
   */
  _ehNaviPaging: function(self) {
    // "<< 1"
    $(self.elem.navi).find('.navi_first').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._firstPage(self);
    });

    // "< prev"
    $(self.elem.navi).find('.navi_prev').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._prevPage(self);
    });

    // the number of page
    $(self.elem.navi).find('.navi_page').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();

      if (!self.prop.is_suggest) self.prop.page_all     = parseInt($(this).text(), 10);
      else                       self.prop.page_suggest = parseInt($(this).text(), 10);

      self.prop.is_paging = true;
      self._suggest(self);
    });

    // "next >"
    $(self.elem.navi).find('.navi_next').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._nextPage(self);
    });

    // "last >>"
    $(self.elem.navi).find('.navi_last').mouseup(function(ev) {
      $(self.elem.combo_input).focus();
      ev.preventDefault();
      self._lastPage(self);
    });
  },

  /**
   * @private
   * @desc ????????: ???????
   */
  _ehTextArea: function() {
    var self = this;
    if (!self.option.shorten_btn) return;
    // URL??????
    $(self.option.shorten_btn).click(function() {
      self._getShortURL(self);
    });
  },

  /**
   * @private
   * @desc ???????????URL?????
   */
  _getShortURL: function(self) {
    // ?????????????
    $(self.elem.combo_input).attr('disabled', 'disabled');

    var text = $(self.elem.combo_input).val(); // Ajax??????
    var matches = []; // ???????????
    var arr = null; // ????????????

    while ((arr = self.option.shorten_reg.exec(text)) !== null) {
      matches[matches.length] = arr[1];
    }
    // URL????????????
    // ???????????????????????????
    if (matches.length < 1) {
      // ?????????????
      $(self.elem.combo_input).removeAttr('disabled');
      return;
    }
    // ???????????????
    var obj_param = {};
    for (var i = 0; i < matches.length; i++) {
      obj_param['p_' + i] = matches[i];
    }
    // bitly???
    $.ajax({
      dataType: 'json',
      url: self.option.shorten_src,
      data: obj_param,
      success: function (json) {
        // ?URL???URL????????
        var i = 0;
        var result = text.replace(self.option.shorten_reg, function() {
          var matched = arguments[0].replace(arguments[1], json[i]);
          i++;
          return matched;
        });
        // ??????
        $(self.elem.combo_input).val(result);
        self.prop.prev_value = result;
        self._disableButtonShort(self);
      },
      error: function(jqXHR, textStatus, errorThrown) { self._ajaxErrorNotify(self, errorThrown); },
      complete: function() {
        // ?????????????
        $(self.elem.combo_input).removeAttr('disabled').focus();
      }
     });
  },

  /**
   * @private
   * @desc Ajax????????????
   * @param {Object} self - ??????????????????????
   * @errorThrom {string} errorThrown - ?????????????????
   */
  _ajaxErrorNotify: function(self, errorThrown) {
    //TODO: ??????????????????????????
    //TODO: errorThrown??????
    alert(self.message.ajax_error);
  },


  /**
   * @private
   * @desc ??????????????????????
   *       (??????????????????????)
   * @param {Object} self - ??????????????????????
   * @param {boolean} enforce - ?????????????????????????
   */
  _scrollWindow: function(self, enforce) {
    // ?????????
    var current_result = self._getCurrentLine(self);

    var target_top = (current_result && !enforce) ?
      current_result.offset().top :
      $(self.elem.container).offset().top;

    var target_size;

    // ????????????????????????
    if (self.option.sub_info) {
      var dl = $(self.elem.sub_info).children('dl:visible');
      target_size =
        $(dl).height() +
        parseInt($(dl).css('border-top-width')) +
        parseInt($(dl).css('border-bottom-width'));
    } else {
      self.prop.size_li = $(self.elem.results).children('li:first').outerHeight();
      target_size = self.prop.size_li;
    }
    var client_height = $(window).height();
    var scroll_top = $(window).scrollTop();
    var scroll_bottom = scroll_top + client_height - target_size;

    // ???????
    var gap;
    if ($(current_result).length) {
      if (target_top < scroll_top || target_size > client_height) {
        // ???????
        // ???????????????????????????????
        gap = target_top - scroll_top;
      } else if (target_top > scroll_bottom) {
        // ???????
        gap = target_top - scroll_bottom;
      } else {
        // ???????????
        return;
      }
    } else if (target_top < scroll_top) {
      gap = target_top - scroll_top;
    }
    window.scrollBy(0, gap);
  },

  /**
   * @private
   * @desc ?????:??????:???????:??
   * @param {Object} self - ??????????????????????
   */
  _setCssFocusedInput: function(self) {
    $(self.elem.results).addClass(self.css_class.re_off);
    $(self.elem.combo_input).removeClass(self.css_class.input_off);
    $(self.elem.sub_info).children('dl').hide();
  },

  /**
   * @private
   * @desc ?????:??????:??
   * @param {Object} self - ??????????????????????
   */
  _setCssFocusedResults: function(self) {
    $(self.elem.results).removeClass(self.css_class.re_off);
    $(self.elem.combo_input).addClass(self.css_class.input_off);
  },

  /**
   * @private
   * @desc URL?????????????
   * @param {Object} self - ??????????????????????
   */
  _enableButtonShort: function(self) {
    $(self.option.shorten_btn)
      .removeClass(self.css_class.btn_short_off)
      .removeAttr('disabled');
  },

  /**
   * @private
   * @desc URL?????????????
   * @param {Object} self - ??????????????????????
   */
  _disableButtonShort: function(self) {
    $(self.option.shorten_btn)
      .addClass(self.css_class.btn_short_off)
      .attr('disabled', 'disabled');
  },

  /**
   * @private
   * @desc ??????????????????
   * @param {Object} self - ??????????????????????
   */
  _setTimerCheckValue: function(self) {
    self.prop.timer_valchange = setTimeout(function() {
      self._checkValue(self);
    }, 500);
  },

  /**
   * @private
   * @desc ?????????????
   * @param {Object} self - ??????????????????????
   */
  _checkValue: function(self) {
    var now_value = $(self.elem.combo_input).val();
    if (now_value != self.prop.prev_value) {
      self.prop.prev_value = now_value;
      if (self.option.plugin_type == 'textarea') {
        // URL?????????????????????
        self._findUrlToShorten(self);

        // ????????????????
        var tag = self._findTag(self, now_value);
        if (tag) {
          self._setTextAreaNewSearch(self, tag);
          self._suggest(self);
        }
      } else {
        // sub_info?????
        $(self.elem.combo_input).removeAttr('sub_info');

        // hidden?????
        if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val('');

        // ???????
        if (self.option.select_only) self._setButtonAttrDefault();

        // ?????????
        self.prop.page_suggest = 1;
        self.prop.is_suggest = true;
        self._suggest(self);
      }
    } else if (
      // textarea??????????????????????????
      self.option.plugin_type == 'textarea' &&
      $(self.elem.result_area).is(':visible')
    ) {
      var new_tag = self._findTag(self, now_value);
      if (!new_tag) {
        self._hideResults(self);
      } else if (
        new_tag.str != self.prop.tag.str ||
        new_tag.pos_left != self.prop.tag.pos_left
      ) {
        self._setTextAreaNewSearch(self, new_tag);
        self._suggest(self);
      }
    }
    // ????????????
    self._setTimerCheckValue(self);
  },

  /**
   * @private
   * @desc ????????????????????????????
   * @param {Object} self - ??????????????????????
   * @param {Object} tag - ??1???????????????
   */
  _setTextAreaNewSearch: function (self, tag) {
    self.prop.tag             = tag;
    self.prop.page_suggest    = 1;
    self.option.search_field  = self.option.tags[self.prop.tag.type].search_field;
    self.option.order_by      = self.option.tags[self.prop.tag.type].order_by;
    self.option.primary_key   = self.option.tags[self.prop.tag.type].primary_key;
    self.option.db_table      = self.option.tags[self.prop.tag.type].db_table;
    self.option.field         = self.option.tags[self.prop.tag.type].field;
    self.option.sub_info      = self.option.tags[self.prop.tag.type].sub_info;
    self.option.sub_as        = self.option.tags[self.prop.tag.type].sub_as;
    self.option.show_field    = self.option.tags[self.prop.tag.type].show_field;
    self.option.hide_field    = self.option.tags[self.prop.tag.type].hide_field;
  },

  /**
   * @private
   * @desc URL?????????????????????
   * @param {Object} self - ??????????????????????
   * @param {Object} tag - ??1???????????????
   */
  _findUrlToShorten: function(self) {
    var flag = null;
    var arr  = null; // ????????????
    while ((arr = self.option.shorten_reg.exec($(self.elem.combo_input).val())) !== null) {
      flag = true;
      self.option.shorten_reg.lastIndex = 0; // .exec() ????????????????????????
      break;
    }
    if (flag) self._enableButtonShort(self);
    else self._disableButtonShort(self);
  },

  /**
   * @private
   * @desc ?????????????(??)?????
   * @param {Object} self - ??????????????????????
   * @param {string} now_value - ?????????
   * @return {Array} - ?????????????????????(???)?????????
   */
  _findTag: function(self, now_value) {
    // ??????????
    var pos  = self._getCaretPosition($(self.elem.combo_input).get(0));

    // ???????????????
    var left, pos_left, right, pos_right, str;
    for (var i = 0; i < self.option.tags.length; i++) {
      // ????????????????????
      left = now_value.substring(0, pos);
      left = left.match(self.option.tags[i].pattern.reg_left);
      if (!left) continue;
      left = left[1]; // ???????????!
      pos_left = pos - left.length;
      if (pos_left < 0) pos_left = 0;

      // ????????????????????
      right = now_value.substring(pos, now_value.length);
      right = right.match(self.option.tags[i].pattern.reg_right);
      if (right) {
        right = right[1]; // ???????????!
        pos_right = pos + right.length;
      } else {
        right = '';
        pos_right = pos;
      }
      str = left + '' + right;
      self.prop.is_suggest = (str === '') ? false : true;
      return {
        type: i,
        str: str,
        pos_left: pos_left,
        pos_right: pos_right
      };
    }
    return false;
  },

  /**
   * @private
   * @desc ???????????
   * @param {Object} item - ????????????? "$(elem).get(0)"
   * @return {number} - ??????????
   */
  _getCaretPosition: function(item) {
    var pos = 0;
    if (document.selection) {
      // IE
      item.focus();
      var obj_select = document.selection.createRange();
      obj_select.moveStart ("character", -item.value.length);
      pos = obj_select.text.length;
    } else if (item.selectionStart || item.selectionStart == "0") {
      // Firefox, Chrome
      pos = item.selectionStart;
    }
    return pos;
  },

  /**
   * @private
   * @desc ????????????????
   * @param {Object} self - ??????????????????????
   * @param {number} pos - ?????????????
   */
  _setCaretPosition: function(self, pos) {
    var item = $(self.elem.combo_input).get(0);
    if (item.setSelectionRange) {
      // Firefox, Chrome
      item.focus();
      item.setSelectionRange(pos, pos);
    } else if (item.createTextRange) {
      // IE
      var range = item.createTextRange();
      range.collapse(true);
      range.moveEnd("character", pos);
      range.moveStart("character", pos);
      range.select();
    }
  },

  /**
   * @private
   * @desc ????????
   * @param {Object} self - ??????????????????????
   * @param {Object} e - jQuery???????????
   */
  _processKey: function(self, e) {
    if (
      ($.inArray(e.keyCode, [27,38,40,9]) > -1 && $(self.elem.result_area).is(':visible')) ||
      ($.inArray(e.keyCode, [37,39,13,9]) > -1 && self._getCurrentLine(self)) ||
      (e.keyCode == 40 && self.option.plugin_type != 'textarea')
    ) {
      e.preventDefault();
      e.stopPropagation();
      e.cancelBubble = true;
      e.returnValue  = false;

      switch (e.keyCode) {
        case 37: // left
          if (e.shiftKey) self._firstPage(self);
          else            self._prevPage(self);
          break;

        case 38: // up
          self.prop.key_select = true;
          self._prevLine(self);
          break;

        case 39: // right
          if (e.shiftKey) self._lastPage(self);
          else            self._nextPage(self);
          break;

        case 40: // down
          if ($(self.elem.results).children('li').length) {
            self.prop.key_select = true;
            self._nextLine(self);
          } else {
            self.prop.is_suggest = false;
            self._suggest(self);
          }
          break;

        case 9: // tab
          self.prop.key_paging = true;
          self._hideResults(self);
          break;

        case 13: // return
          self._selectCurrentLine(self, true);
          break;

        case 27: //  escape
          self.prop.key_paging = true;
          self._hideResults(self);
          break;
      }
    } else {
      if (e.keyCode != 16) self._setCssFocusedInput(self); // except Shift(16)
      self._checkValue(self);
    }
  },

  /**
   * @private
   * @desc Ajax???????
   * @param {Object} self - ??????????????????????
   */
  _abortAjax: function(self) {
    if (self.prop.xhr) {
      self.prop.xhr.abort();
      self.prop.xhr = false;
    }
  },

  /**
   * @private
   * @desc ????????????????????
   * @param {Object} self - ??????????????????????
   */
  _suggest: function(self) {
    // ??????????????????????????
    var q_word;
    if (self.option.plugin_type != 'textarea') {
      q_word = (self.prop.is_suggest) ? $.trim($(self.elem.combo_input).val()) : '';
      if (q_word.length < 1 && self.prop.is_suggest) {
        self._hideResults(self);
        return;
      }
      q_word = q_word.split(/[\s ]+/);
    } else {
      q_word = [self.prop.tag.str];
    }

    self._abortAjax(self);
    self._setLoading(self);
    $(self.elem.sub_info).children('dl').hide(); // ??????

    // ?????????????????????????????
    if (self.prop.is_paging) {
      var obj = self._getCurrentLine(self);
      self.prop.is_paging = (obj) ? $(self.elem.results).children('li').index(obj) : -1;
    } else if (!self.prop.is_suggest) {
      self.prop.is_paging = 0;
    }
    var which_page_num = (self.prop.is_suggest) ? self.prop.page_suggest : self.prop.page_all;

    // ?????
    if (typeof self.option.source == 'object') self._searchForJson(self, q_word, which_page_num);
    else                                       self._searchForDb(self, q_word, which_page_num);
  },

  /**
   * @private
   * @desc ?????????????
   * @param {Object} self - ??????????????????????
   */
  _setLoading: function(self) {
    $(self.elem.navi_info).text(self.message.loading);
    if ($(self.elem.results).html() === '') {
      $(self.elem.navi).children('p').empty();
      self._calcWidthResults(self);
      $(self.elem.container).addClass(self.css_class.container_open);
    }
  },

  /**
   * @private
   * @desc ??????????????
   * @param {Object} self - ??????????????????????
   * @param {Array} q_word - ???????????
   * @param {number} which_page_num - ?????
   */
  _searchForDb: function(self, q_word, which_page_num) {
    self.prop.xhr = $.ajax({
      dataType: 'json',
      url: self.option.source,
      data: {
        q_word: q_word,
        page_num: which_page_num,
        per_page: self.option.per_page,
        search_field: self.option.search_field,
        and_or: self.option.and_or,
        order_by: self.option.order_by,
        db_table: self.option.db_table
      },
      success: function(json) {
        json.candidate   = [];
        json.primary_key = [];
        json.subinfo     = [];
        if (typeof json.result != 'object') {
          // ???????????
          self.prop.xhr = null;
          self._notFoundSearch(self);
          return;
        }
        json.cnt_page = json.result.length;
        for (i = 0; i < json.cnt_page; i++) {
          json.subinfo[i] = [];
          for (var key in json.result[i]) {
            if (key == self.option.primary_key) {
              json.primary_key.push(json.result[i][key]);
            }
            if (key == self.option.field) {
              json.candidate.push(json.result[i][key]);
            } else if ($.inArray(key, self.option.hide_field) == -1) {
              if (
                self.option.show_field !== '' &&
                $.inArray('*', self.option.show_field) == -1 &&
                $.inArray(key, self.option.show_field) == -1
              ) {
                continue;
              } else {
                json.subinfo[i][key] = json.result[i][key];
              }
            }
          }
        }
        delete(json.result);
        self._prepareResults(self, json, q_word, which_page_num);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        // ??Ajax???????????????????????????
        // ???????????????
        if (textStatus != 'abort') {
          self._hideResults(self);
          self._ajaxErrorNotify(self, errorThrown);
        }
      },
      complete: function() { self.prop.xhr = null; }
    });
  },

  /**
   * @private
   * @desc ????????????
   * @param {Object} self - ??????????????????????
   * @param {Array} q_word - ???????????
   * @param {number} which_page_num - ?????
   */
  _searchForJson: function(self, q_word, which_page_num) {
    var matched = [];
    var esc_q = [];
    var sorted = [];
    var json = {};
    var i = 0;
    var arr_reg = [];

    do { // ????????do-while?????
      // ???????????????
      esc_q[i] = q_word[i].replace(/\W/g,'\\$&').toString();
      arr_reg[i] = new RegExp(esc_q[i], 'gi');
      i++;
    } while (i < q_word.length);

    // SELECT * FROM source WHERE field LIKE q_word;
    for (i = 0; i < self.option.source.length; i++) {
      var flag = false;
      for (var j=0; j<arr_reg.length; j++) {
        if (self.option.source[i][self.option.field].match(arr_reg[j])) {
          flag = true;
          if (self.option.and_or == 'OR') break;
        } else {
          flag = false;
          if (self.option.and_or == 'AND') break;
        }
      }
      if (flag) matched.push(self.option.source[i]);
    }

    // ?????????????
    if (matched.length === undefined) {
      self._notFoundSearch(self);
      return;
    }
    json.cnt_whole = matched.length;

    // (CASE WHEN ...)????? order ??
    var reg1 = new RegExp('^' + esc_q[0] + '$', 'gi');
    var reg2 = new RegExp('^' + esc_q[0], 'gi');
    var matched1 = [];
    var matched2 = [];
    var matched3 = [];
    for (i = 0; i < matched.length; i++) {
      if (matched[i][self.option.order_by[0][0]].match(reg1)) {
        matched1.push(matched[i]);
      } else if (matched[i][self.option.order_by[0][0]].match(reg2)) {
        matched2.push(matched[i]);
      } else {
        matched3.push(matched[i]);
      }
    }

    if (self.option.order_by[0][1].match(/^asc$/i)) {
      matched1 = self._sortAsc(self, matched1);
      matched2 = self._sortAsc(self, matched2);
      matched3 = self._sortAsc(self, matched3);
    } else {
      matched1 = self._sortDesc(self, matched1);
      matched2 = self._sortDesc(self, matched2);
      matched3 = self._sortDesc(self, matched3);
    }
    sorted = sorted.concat(matched1).concat(matched2).concat(matched3);

    // LIMIT xx OFFSET xx
    var start = (which_page_num - 1) * self.option.per_page;
    var end   = start + self.option.per_page;

    // ???????????????
    for (i = start, sub = 0; i < end; i++, sub++) {
      if (sorted[i] === undefined) break;
      for (var key in sorted[i]) {
        // ??????
        if (key == self.option.primary_key) {
          if (json.primary_key === undefined) json.primary_key = [];
          json.primary_key.push(sorted[i][key]);
        }
        if (key == self.option.field) {
          // ???????
          if (json.candidate === undefined) json.candidate = [];
          json.candidate.push(sorted[i][key]);
        } else {
          // ????
          if ($.inArray(key, self.option.hide_field) == -1) {
            if (
              self.option.show_field !== '' &&
              $.inArray('*', self.option.show_field) == -1 &&
              $.inArray(key, self.option.show_field) == -1
            ) {
              continue;
            }
            if (json.subinfo === undefined) json.subinfo = [];
            if (json.subinfo[sub] === undefined) json.subinfo[sub] = [];
            json.subinfo[sub][key] = sorted[i][key];
          }
        }
      }
    }
    // json.cnt_page = json.candidate.length;
    if (json.candidate === undefined) json.candidate = [];
    json.cnt_page = json.candidate.length;
    self._prepareResults(self, json, q_word, which_page_num);
  },

  /**
   * @private
   * @desc ?????? (??)
   * @param {Object} self - ??????????????????????
   * @param {Array} arr - ???????
   */
  _sortAsc: function(self, arr) {
    arr.sort(function(a, b) {
      return a[self.option.order_by[0][0]].localeCompare(b[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc ?????? (??)
   * @param {Object} self - ??????????????????????
   * @param {Array} arr - ???????
   */
  _sortDesc: function(self, arr) {
    arr.sort(function(a, b) {
      return b[self.option.order_by[0][0]].localeCompare(a[self.option.order_by[0][0]]);
    });
    return arr;
  },

  /**
   * @private
   * @desc ???????????????????
   * @param {Object} self - ??????????????????????
   */
  _notFoundSearch: function(self) {
    $(self.elem.navi_info).text(self.message.not_found);
    $(self.elem.navi_p).hide();
    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    self._calcWidthResults(self);
    $(self.elem.container).addClass(self.css_class.container_open);
    self._setCssFocusedInput(self);
  },

  /**
   * @private
   * @desc ????????????
   * @param {Object} self - ??????????????????????
   * @param {Object} json - ???????????
   * @param {Array} q_word - ???????????
   * @param {number} which_page_num - ?????
   */
  _prepareResults: function(self, json, q_word, which_page_num) {
    // 1??????????????
    self._setNavi(self, json.cnt_whole, json.cnt_page, which_page_num);

    if (!json.subinfo || !self.option.sub_info) json.subinfo = false;
    if (!json.primary_key) json.primary_key = false;

    // ???????
    // ????????????????????????
    // ???????????????????????????????
    // ?????????????????
    if (
      self.option.select_only &&
      json.candidate.length === 1 &&
      json.candidate[0] == q_word[0]
    ) {
      if (self.option.plugin_type != 'textarea') $(self.elem.hidden).val(json.primary_key[0]);
      this._setButtonAttrDefault();
    }
    // ??????????
    self._displayResults(self, json.candidate, json.subinfo, json.primary_key);
    if (self.prop.is_paging === false) {
      self._setCssFocusedInput(self);
    } else {
      // ???????????????????????????????
      var idx = self.prop.is_paging; // ??????????????????????????
      var limit = $(self.elem.results).children('li').length - 1;
      if (idx > limit) idx = limit;
      var obj = $(self.elem.results).children('li').eq(idx);
      $(obj).addClass(self.css_class.select);
      self._setSubInfo(self, obj);
      self.prop.is_paging = false; // ???????????

      self._setCssFocusedResults(self);
    }
  },

  /**
   * @private
   * @desc ?????????
   * @param {Object} self - ??????????????????????
   * @param {number} cnt_whole - ???????
   * @param {number} cnt_page - ???????????????
   * @param {number} page_num - ????????
   */
  _setNavi: function(self, cnt_whole, cnt_page, page_num) {
    var num_page_top = self.option.per_page * (page_num - 1) + 1;
    var num_page_end = num_page_top + cnt_page - 1;
    var cnt_result = self.message.page_info
      .replace('cnt_whole'    , cnt_whole)
      .replace('num_page_top' , num_page_top)
      .replace('num_page_end' , num_page_end);
    $(self.elem.navi_info).text(cnt_result);

    // ???????
    var last_page = Math.ceil(cnt_whole / self.option.per_page); // ?????
    if (last_page > 1) {
      $(self.elem.navi_p).empty();
      // ????
      if (self.prop.is_suggest) {
        self.prop.max_suggest = last_page;
      } else {
        self.prop.max_all = last_page;
      }
      // ????????????????
      var left  = page_num - Math.ceil ((self.option.navi_num - 1) / 2);
      var right = page_num + Math.floor((self.option.navi_num - 1) / 2);
      // ????????????left,right???
      while (left < 1) {
        left ++;
        right++;
      }
      while (right > last_page) right--;
      while ((right-left < self.option.navi_num - 1) && left > 1) left--;

      // ?<< ??????
      if (page_num == 1) {
        if (!self.option.navi_simple) {
          $('<span>')
            .text('<< 1')
            .addClass('page_end')
            .appendTo(self.elem.navi_p);
        }
        $('<span>')
          .text(self.message.prev)
          .addClass('page_end')
          .appendTo(self.elem.navi_p);
      } else {
        if (!self.option.navi_simple) {
          $('<a>')
            .attr({
              'href': '#',
              'class': 'navi_first'
            })
            .text('<< 1')
            .attr('title', self.message.first_title)
            .appendTo(self.elem.navi_p);
        }
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_prev',
            'title': self.message.prev_title
          })
          .text(self.message.prev)
          .appendTo(self.elem.navi_p);
      }
      // ????????????
      for (var i = left; i <= right; i++) {
        // ?????????<span>???(?????)
        var num_link = (i == page_num) ? '<span class="current">' + i + '</span>' : i;
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_page'
          })
          .html(num_link)
          .appendTo(self.elem.navi_p);
      }
      // ???X? >>????
      if (page_num == last_page) {
        $('<span>')
          .text(self.message.next)
          .addClass('page_end')
          .appendTo(self.elem.navi_p);
        if (!self.option.navi_simple) {
          $('<span>')
            .text(last_page + ' >>')
            .addClass('page_end')
            .appendTo(self.elem.navi_p);
        }
      } else {
        $('<a>')
          .attr({
            'href': '#',
            'class': 'navi_next'
          })
          .text(self.message.next)
          .attr('title', self.message.next_title)
          .appendTo(self.elem.navi_p);
        if (!self.option.navi_simple) {
          $('<a>')
            .attr({
              'href': '#',
              'class': 'navi_last'
            })
            .text(last_page + ' >>')
            .attr('title', self.message.last_title)
            .appendTo(self.elem.navi_p);
        }
      }
      $(self.elem.navi_p).show();
      self._ehNaviPaging(self); // ??????????
    } else {
      $(self.elem.navi_p).hide();
    }
  },

  /**
   * @private
   * @desc ?????????
   * @param {Object} self - ??????????????????????
   * @param {Object} obj - ?????????????<li>??
   */
  _setSubInfo: function(self, obj) {
    // ????????????????????
    if (!self.option.sub_info) return; 

    // ???????????????
    self.prop.size_results = ($(self.elem.results).outerHeight() - $(self.elem.results).height()) / 2;
    self.prop.size_navi    = $(self.elem.navi).outerHeight();
    self.prop.size_li      = $(self.elem.results).children('li:first').outerHeight();
    self.prop.size_left    = $(self.elem.results).outerWidth();

    // ???<li>?????
    var idx = $(self.elem.results).children('li').index(obj);

    // ??????????? (<dl>?????????)
    $(self.elem.sub_info).children('dl').hide();

    // ????
    var t_top = 0;
    if ($(self.elem.navi).css('display') != 'none') t_top += self.prop.size_navi;
    t_top += (self.prop.size_results + self.prop.size_li * idx);
    var t_left = self.prop.size_left;
    t_top  += 'px';
    t_left += 'px';

    $(self.elem.sub_info).children('dl').eq(idx).css({
      position: 'absolute',
      top: t_top,
      left: t_left,
      display: 'block'
    });
  },

  /**
   * @private
   * @desc ?????<ul>?????
   * @param {Object} self - ??????????????????????
   * @param {Array} arr_candidate - DB????�????????
   * @param {Array} arr_subinfo - ???????
   * @param {Array} arr_primary_key - ??????
   */
  _displayResults: function(self, arr_candidate, arr_subinfo, arr_primary_key) {
    // ?????????????
    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    for (var i = 0; i < arr_candidate.length; i++) {

      // ?????
      var list = $('<li>')
        .text(arr_candidate[i]) // XSS??
        .attr({
          pkey: arr_primary_key[i],
          title: arr_candidate[i]
        });

      if (
        self.option.plugin_type != 'textarea' &&
        arr_primary_key[i] == $(self.elem.hidden).val()
      ) {
        $(list).addClass(self.css_class.selected);
      }
      $(self.elem.results).append(list);

      // ?????dl???
      if (arr_subinfo) {
        // sub_info???JSON??????????
        var str_subinfo = [];
        var $dl = $('<dl>');
        // ??????????
        var dt, dd;
        for (var key in arr_subinfo[i]) {
          // sub_info????????
          var json_key = key.replace('\'', '\\\'');

          if (arr_subinfo[i][key] === null) {
            // DB??????null??????
            arr_subinfo[i][key] = '';
          } else {
            // DB??????????????
            arr_subinfo[i][key] += '';
          }
          var json_val = arr_subinfo[i][key].replace('\'', '\\\'');

          str_subinfo.push("'" + json_key + "':" + "'" + json_val + "'");

          // th????????
          if (self.option.sub_as[key] !== null) dt = self.option.sub_as[key];
          else dt = key;

          dt = $('<dt>').text(dt); // XSS??
          if (self.option.sub_info == 'simple') $(dt).addClass('hide');
          $dl.append(dt);

          dd = $('<dd>').text(arr_subinfo[i][key]); // !!! against XSS !!!
          $dl.append(dd);
        }
        // sub_info?????????li???
        str_subinfo = '{' + str_subinfo.join(',') + '}';
        $(list).attr('sub_info', str_subinfo);
        
        $(self.elem.sub_info).append($dl);
        if (self.option.sub_info == 'simple' && $dl.children('dd').text() === '') {
          $dl.addClass('ac_dl_empty');
        }
      }
    }
    // ?????????
    // ??????????????????????????
    // ???????????????????????????????????????
    self._calcWidthResults(self);

    $(self.elem.container).addClass(self.css_class.container_open);
    self._ehResults(); // ??????????

    // ????title????(???)
    if (self.option.plugin_type == 'combobox') $(self.elem.button).attr('title', self.message.close_btn);
  },

  /**
   * @private
   * @desc ???????????
   * @param {Object} self - ??????????????????????
   */
  _calcWidthResults: function(self) {
    // ?????????????? (textarea?????????????????)
    // ComboBox??
    var w;
    if (self.option.plugin_type == 'combobox') {
      w = $(self.elem.combo_input).outerWidth() + $(self.elem.button).outerWidth();
    } else {
      w = $(self.elem.combo_input).outerWidth();
    }
    $(self.elem.container).width(w);
    
    // container?position???????top,left??????
    if ($(self.elem.container).css('position') == 'static') {
      // position: static
      var offset = $(self.elem.combo_input).offset();
      $(self.elem.result_area).css({
        top: offset.top + $(self.elem.combo_input).outerHeight() + 'px',
        left: offset.left + 'px'
      });
    } else {
      // position: relative, absolute, fixed
      $(self.elem.result_area).css({
        top: $(self.elem.combo_input).outerHeight() + 'px',
        left: '0px'
      });
    }
    // ?????????????
    $(self.elem.result_area)
      .width(
        $(self.elem.container).width() -
        ($(self.elem.result_area).outerWidth() - $(self.elem.result_area).innerWidth())
      )
      .show();
  },

  /**
   * @private
   * @desc ?????????
   * @param {Object} self - ??????????????????????
   */
  _hideResults: function(self) {
    if (self.prop.key_paging) {
      self._scrollWindow(self, true);
      self.prop.key_paging = false;
    }
    self._setCssFocusedInput(self);

    $(self.elem.results).empty();
    $(self.elem.sub_info).empty();
    $(self.elem.result_area).hide();
    $(self.elem.container).removeClass(self.css_class.container_open);

    self._abortAjax(self);
    self._setButtonAttrDefault(); // ????title?????
  },

  /**
   * @private
   * @desc 1?????????
   * @param {Object} self - ??????????????????????
   */
  _firstPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest = 1;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc ??????????
   * @param {Object} self - ??????????????????????
   */
  _prevPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all > 1) {
        self.prop.page_all--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest > 1) {
        self.prop.page_suggest--;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc ??????????
   * @param {Object} self - ??????????????????????
   */
  _nextPage: function(self) {
    if (self.prop.is_suggest) {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all++;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc ???????????
   * @param {Object} self - ??????????????????????
   */
  _lastPage: function(self) {
    if (!self.prop.is_suggest) {
      if (self.prop.page_all < self.prop.max_all) {
        self.prop.page_all = self.prop.max_all;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    } else {
      if (self.prop.page_suggest < self.prop.max_suggest) {
        self.prop.page_suggest = self.prop.max_suggest;
        self.prop.is_paging = true;
        self._suggest(self);
      }
    }
  },

  /**
   * @private
   * @desc ?????????????
   * @param {Object} self - ??????????????????????
   * @param {boolean} is_enter_key - Enter????????????
   */
  _selectCurrentLine: function(self, is_enter_key) {
    // ???????????????
    self._scrollWindow(self, true);

    var current = self._getCurrentLine(self);
    if (current) {
      if (self.option.plugin_type != 'textarea') {
        $(self.elem.combo_input).val($(current).text());

        // ?????????sub_info?????�????
        if (self.option.sub_info) {
          $(self.elem.combo_input).attr('sub_info', $(current).attr('sub_info'));
        }
        if (self.option.select_only) self._setButtonAttrDefault();
        $(self.elem.hidden).val($(current).attr('pkey'));
      } else {
        var left = self.prop.prev_value.substring(0, self.prop.tag.pos_left);
        var right = self.prop.prev_value.substring(self.prop.tag.pos_right);
        var ctext, p_len, l_len, pos;

        // ??????????????right???????????????????
        // ?????????????????????????
        // ?????????????????
        ctext = $(current).text();
        // ???????
        if (
          self.option.tags[self.prop.tag.type].space[0] &&
          !left.match(self.option.tags[self.prop.tag.type].pattern.space_left)
        ) {
          p_len = self.option.tags[self.prop.tag.type].pattern.left.length;
          l_len = left.length;
          left = left.substring(0, (l_len - p_len)) +
            ' ' +
            left.substring((l_len - p_len));
        }
        // ????????
        if (!right.match(self.option.tags[self.prop.tag.type].pattern.comp_right)) {
          right = self.option.tags[self.prop.tag.type].pattern.right + right;
        }
        // ???????
        if (
          self.option.tags[self.prop.tag.type].space[1] &&
          !right.match(self.option.tags[self.prop.tag.type].pattern.space_right)
        ) {
          p_len = self.option.tags[self.prop.tag.type].pattern.right.length;
          right = right.substring(0, p_len) +
            ' ' +
            right.substring(p_len);
        }
        $(self.elem.combo_input).val(left + '' + ctext + '' + right);
        pos = left.length + ctext.length;
        self._setCaretPosition(self, pos);
      }
      self.prop.prev_value = $(self.elem.combo_input).val();
      self._hideResults(self);
    }
    if (self.option.bind_to) {
      // ???????????????????
      $(self.elem.combo_input).trigger(self.option.bind_to, is_enter_key);
    }
    $(self.elem.combo_input).focus();  // ?????????????????
    $(self.elem.combo_input).change(); // ????????????????????
    self._setCssFocusedInput(self);
  },

  /**
   * @private
   * @desc ????????????????
   * @param {Object} self - ??????????????????????
   */
  _getCurrentLine: function(self) {
    if ($(self.elem.result_area).is(':hidden')) return false;
    var obj = $(self.elem.results).children('li.' + self.css_class.select);
    if ($(obj).length) return obj;
    else               return false;
  },

  /**
   * @private
   * @desc ?????????
   * @param {Object} self - ??????????????????????
   */
  _nextLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = -1;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx++;
    if (idx < $(self.elem.results).children('li').length) {
      var next = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, next);
      $(next).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // ???????????????
    self._scrollWindow(self, false);
  },

  /**
   * @private
   * @desc ?????????
   * @param {Object} self - ??????????????????????
   */
  _prevLine: function(self) {
    var obj = self._getCurrentLine(self);
    var idx;
    if (!obj) {
      idx = $(self.elem.results).children('li').length;
    } else {
      idx = $(self.elem.results).children('li').index(obj);
      $(obj).removeClass(self.css_class.select);
    }
    idx--;
    if (idx > -1) {
      var prev = $(self.elem.results).children('li').eq(idx);
      self._setSubInfo(self, prev);
      $(prev).addClass(self.css_class.select);
      self._setCssFocusedResults(self);
    } else {
      self._setCssFocusedInput(self);
    }
    // ???????????????
    self._scrollWindow(self, false);
  }
}); // END OF "$.extend(AjaxComboBox.prototype,"

})( /** namespace */ jQuery);