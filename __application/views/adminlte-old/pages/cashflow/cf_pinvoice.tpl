<!-- Content Wrapper. Contains page content -->
<div class="content-wrapper">
	<!-- Main content -->
	<section class="content">
		<!-- /.row -->
		<div class="box box-body datagrid table-responsive no-padding"></div>
		<!-- /.box -->
	</section>
	<!-- /.content -->
</div>
<!-- /.content-wrapper -->
{$.php.link_tag($.const.TEMPLATE_URL~'plugins/bootstrap-multiselect/css/bootstrap-multiselect.css')}
<script src="{$.const.TEMPLATE_URL}plugins/bootstrap-validator/validator.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/accounting/accounting.min.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.date.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/inputmask.numeric.extensions.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/inputmask/jquery.inputmask.js"></script>
<script src="{$.const.TEMPLATE_URL}plugins/bootstrap-multiselect/js/bootstrap-multiselect.js"></script>
<script>
	var $url_module = "{$.php.base_url()~$class~'/'~$method}", $table = "{$table}", $bread = {$.php.json_encode($bread)};
	{* Toolbar Init *}
	var Toolbar_Init = {
		enable: true,
		toolbarBtn: ['btn-new','btn-copy','btn-refresh','btn-delete','btn-message','btn-print','btn-export','btn-import','btn-viewlog','btn-process'],
		disableBtn: ['btn-copy','btn-message','btn-print','btn-process'],
		hiddenBtn: ['btn-copy','btn-message'],
		processMenu: [{ id:"btn-process1", title:"Process 1" }, { id:"btn-process2", title:"Process 2" }, ],
		processMenuDisable: ['btn-process1'],
	};
	if ("{$is_canimport}" == "0") Toolbar_Init.disableBtn.push('btn-import');
	if ("{$is_canexport}" == "0") Toolbar_Init.disableBtn.push('btn-export');
	{* DataTable Init *}
	var format_money = function(money){ return accounting.formatMoney(money, '', {$.session.number_digit_decimal}, "{$.session.group_symbol}", "{$.session.decimal_symbol}") };
	var DataTable_Init = {
		enable: true,
		tableWidth: '125%',
		act_menu: { copy: true, edit: true, delete: true },
		add_menu: [
			{ name: 'actualization', title: 'Actualization' }, 
			{ name: 'adjust_amount', title: 'Adjust Amount' }, 
		],
		sub_menu: [],
		columns: [
			{ width:"100px", orderable:true, data:"org_name", title:"Org Name" },
			{ width:"100px", orderable:true, data:"orgtrx_name", title:"Org Trx Name" },
			{ width:"100px", orderable:true, data:"invoice_status", title:"Status" },
			{ width:"150px", orderable:true, data:"bpartner_name", title:"Business Partner" },
			{ width:"100px", orderable:true, data:"doc_no", title:"Invoice No" },
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"invoice_plan_date", title:"Invoice Plan Date" },
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"doc_date", title:"Invoice Date" },
			{ width:"50px", orderable:true, className:"dt-head-center dt-body-center", data:"late", title:"Late Issued (Days)", 
				render: function(data, type, row){ 
					if ( parseInt(data) > 0 && parseInt(data) <= 7 ) 
						return $("<span>").addClass('label label-warning').text(data).prop('outerHTML');
					else if ( parseInt(data) > 7 ) 
						return $("<span>").addClass('label label-danger').text(data).prop('outerHTML'); 
					else 
						return $("<span>").addClass('label label-success').text(data).prop('outerHTML'); 
				},
			},
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"payment_plan_date_order", title:"Payment Plan Date (PO)" },
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"payment_plan_date", title:"Payment Plan Date (Invoice)" },
			{ width:"100px", orderable:true, data:"doc_no_order", title:"PO Doc No" },
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"doc_date_order", title:"PO Doc Date" },
			{ width:"70px", orderable:true, className:"dt-head-center dt-body-center", data:"eta_order", title:"PO ETA" },
			{ width:"100px", orderable:true, data:"note", title:"Payment Note" },
			{ width:"150px", orderable:true, data:"invoice_type", title:"Invoice Type" },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"amount", title:"Amount", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"adj_amount", title:"Adj Amount", render: function(data, type, row){ return format_money(data); } },
			{ width:"100px", orderable:true, className:"dt-head-center dt-body-right", data:"net_amount", title:"Net Amount", render: function(data, type, row){ return format_money(data); } },
			{ width:"200px", orderable:true, data:"reason_name", title:"Reason", createdCell: function (td, cellData, rowData, row, col) { $(td).css({ 'text-overflow':'unset', 'overflow-x':'auto' }); } },
			{ width:"200px", orderable:true, data:"description", title:"Description" },
		],
		order: ['id desc'],
	};
	
	function actualization(data) {
		var col = [], row = [], a = [];
		var form1 = BSHelper.Form({ autocomplete:"off" });
		var format_money2 = "'alias': 'currency', 'prefix': '', 'groupSeparator': '{$.session.group_symbol}', 'radixPoint': '{$.session.decimal_symbol}', 'digits': {$.session.number_digit_decimal}, 'negationSymbol': { 'front':'-', 'back':'' }, 'autoGroup': true, 'autoUnmask': true";
		a.push(BSHelper.LineDesc({ label:"Purchase Order", value: data.doc_no_order }));
		a.push(BSHelper.LineDesc({ label:"Business Partner", value: data.bpartner_name }));
		a.push(BSHelper.LineDesc({ label:"Invoice Plan Date", value: data.invoice_plan_date }));
		col.push( $('<dl class="dl-horizontal">').append(a) ); a = [];
		col.push(BSHelper.Input({ horz:false, type:"text", label:"Actual Invoice No", idname:"doc_no", format: "'casing': 'upper'", value: data.doc_no, required: true }));
		col.push(BSHelper.Input({ horz:false, type:"date", label:"Invoice date", idname:"doc_date", cls:"auto_ymd", format:"{$.session.date_format}", value: data.doc_date, required: true }));
		col.push(BSHelper.Input({ horz:false, type:"date", label:"Payment Plan date", idname:"payment_plan_date", cls:"auto_ymd", format:"{$.session.date_format}", value: data.payment_plan_date, required: true }));
		row.push(subCol(12, col)); col = [];
		form1.append(subRow(row));
		
		form1.find("[data-mask]").inputmask();
		form1.on('submit', function(e){ e.preventDefault(); });
		
		BootstrapDialog.show({
			title: 'Invoice Actualization', type: BootstrapDialog.TYPE_SUCCESS, size: BootstrapDialog.SIZE_MEDIUM, message: form1, 
			buttons:[{ 
				cssClass: 'btn-primary', label: 'Submit', hotkey: 13, action: function(dialog) {
					var button = this;
					
					if (form1.validator('validate').has('.has-error').length === 0) {
						button.spin();
						button.disable();
						
						form1.append(BSHelper.Input({ type:"hidden", idname:"id", value:data.id }));
						
						{* console.log(form1.serializeJSON()); return false; *}
						
						$.ajax({ url: $url_module+'_actualization', method: "OPTIONS", async: true, dataType: 'json',	data: form1.serializeJSON(),
							success: function(data) {
								BootstrapDialog.show({ closable: false, message:data.message, 
									buttons: [{ label: 'OK', hotkey: 13, action: function(dialogRef){ dialogRef.close(); } }],
								});
								dataTable1.ajax.reload( null, false );
								dialog.close();
								window.history.back(); 
							},
							error: function(data) {
								if (data.status >= 500){
									var message = data.statusText;
								} else {
									var error = JSON.parse(data.responseText);
									var message = error.message;
								}
								button.stopSpin();
								button.enable();
								BootstrapDialog.show({ type:'modal-danger', title:'Notification', message:message, buttons:[{ label:'OK', hotkey:13, action:function(dialogRef){ dialogRef.close(); }}] });
							}
						});
					}
				}
			}, {
				label: 'Cancel', cssClass: 'btn-danger', action: function(dialog) { dialog.close(); window.history.back(); }
			}],
			onshown: function(dialog) {
				{* /* This class is for auto conversion from dmy to ymd */ *}
				$(".auto_ymd").on('change', function(){
					$('input[name="'+$(this).attr('id')+'"]').val( datetime_db_format($(this).val(), $(this).attr('data-format')) );
				}).trigger('change');
			}
		});
		
	};
	
	function adjust_amount(data) {
	
		function calculate_amount(){ 
			$("#net_amount").val( parseFloat($("#amount").val()) + parseFloat($("#adj_amount").val()) );
			$(".auto_ymd").trigger('change');
			form1.validator('update').validator('validate');
		}

		var col = [], row = [], a = [];
		var form1 = BSHelper.Form({ autocomplete:"off" });
		var format_money2 = "'alias': 'currency', 'prefix': '', 'groupSeparator': '{$.session.group_symbol}', 'radixPoint': '{$.session.decimal_symbol}', 'digits': {$.session.number_digit_decimal}, 'negationSymbol': { 'front':'-', 'back':'' }, 'autoGroup': true, 'autoUnmask': true";
		a.push(BSHelper.LineDesc({ label:"Invoice No", value: data.doc_no }));
		a.push(BSHelper.LineDesc({ label:"Purchase Order", value: data.doc_no_order }));
		a.push(BSHelper.LineDesc({ label:"Business Partner", value: data.bpartner_name }));
		col.push( $('<dl class="dl-horizontal">').append(a) ); a = [];
		col.push(BSHelper.Input({ horz:false, type:"text", label:"Original Amount", idname:"amount", style: "text-align: right;", step: ".01", format: format_money2, rrequired: false, value: data.amount, placeholder: "0.00", readonly: true, }));
		col.push(BSHelper.Input({ horz:false, type:"text", label:"Final Amount", idname:"net_amount", style: "text-align: right;", format: format_money2, required: false, value: data.net_amount, placeholder: "0.00", readonly: true, }));
		col.push(BSHelper.Input({ horz:false, type:"number", label:"Adjustment Amount", idname:"adj_amount", style: "text-align: right;", step: ".01", required: false, value: data.adj_amount, placeholder: "0.00", }));
		col.push(BSHelper.Multiselect({ horz:false, label:"Adj Reason", idname:"reasons", url:"{$.php.base_url('cashflow/rf_invoice_adj_reason')}", value: data.reasons, required: true, remote: true }));
		col.push(BSHelper.Input({ horz:false, type:"textarea", label:"Description", idname:"description", }));
		row.push(subCol(12, col)); col = [];
		form1.append(subRow(row));
		
		form1.find("[data-mask]").inputmask();
		form1.on('submit', function(e){ e.preventDefault(); });
		calculate_amount();
		
		$(document).on("change", function(e){	if ($(e.target).is("#adj_amount")) calculate_amount(); });
		
		BootstrapDialog.show({
			title: 'Invoice Adjustment Amount', type: BootstrapDialog.TYPE_SUCCESS, size: BootstrapDialog.SIZE_MEDIUM, message: form1, 
			buttons:[{ 
				cssClass: 'btn-primary', label: 'Submit', hotkey: 13, action: function(dialog) {
					var button = this;
					
					if (form1.validator('validate').has('.has-error').length === 0) {
						button.spin();
						button.disable();
						
						form1.append(BSHelper.Input({ type:"hidden", idname:"id", value:data.id }));
						
						{* console.log(form1.serializeJSON()); return false; *}

						$.ajax({ url: $url_module+'_adjustment', method: "OPTIONS", async: true, dataType: 'json',	data: form1.serializeJSON(),
							success: function(data) {
								BootstrapDialog.show({ closable: false, message:data.message, 
									buttons: [{ label: 'OK', hotkey: 13, action: function(dialogRef){ dialogRef.close(); } }],
								});
								dataTable1.ajax.reload( null, false );
								dialog.close();
								window.history.back(); 
							},
							error: function(data) {
								if (data.status >= 500){
									var message = data.statusText;
								} else {
									var error = JSON.parse(data.responseText);
									var message = error.message;
								}
								button.stopSpin();
								button.enable();
								BootstrapDialog.show({ type:'modal-danger', title:'Notification', message:message, buttons:[{ label:'OK', hotkey:13, action:function(dialogRef){ dialogRef.close(); }}] });
							}
						});
					}
				}
			}, {
				label: 'Cancel', cssClass: 'btn-danger', action: function(dialog) { dialog.close(); window.history.back(); }
			}],
			onshown: function(dialog) {
				{* /* This class is for auto conversion from dmy to ymd */ *}
				$(".auto_ymd").on('change', function(){
					$('input[name="'+$(this).attr('id')+'"]').val( datetime_db_format($(this).val(), $(this).attr('data-format')) );
				}).trigger('change');
			}
		});
		
	};
	
</script>
<script src="{$.const.ASSET_URL}js/window_view.js"></script>
