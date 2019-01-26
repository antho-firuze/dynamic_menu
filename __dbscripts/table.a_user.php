<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

$fields['id'] = ['type' => 'INT', 'constraint' => '32', 'auto_increment' => TRUE];
$fields['parent_id'] 	= ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];					
$fields['client_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['def_role_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['bpartner_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
// $fields['def_orgtrx_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
// $fields['def_org_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
// $fields['def_dept_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
// $fields['def_div_id'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['is_active'] 	= ['type' => 'CHAR', 'constraint' => '1', 'default' => '1'];
$fields['created_at'] = ['type' => 'TIMESTAMP', 'null' => TRUE];
$fields['created_by'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['updated_at'] = ['type' => 'TIMESTAMP', 'null' => TRUE];
$fields['updated_by'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['code'] = ['type' => 'VARCHAR', 'constraint' => '40', 'null' => TRUE];
$fields['name'] = ['type' => 'VARCHAR', 'constraint' => '60', 'null' => FALSE, 'unique' => TRUE];
$fields['description'] = ['type' => 'TEXT', 'null' => TRUE];
$fields['email'] = ['type' => 'VARCHAR', 'constraint' => '40', 'null' => TRUE];
$fields['password'] = ['type' => 'VARCHAR', 'constraint' => '255', 'null' => TRUE];
$fields['salt'] = ['type' => 'VARCHAR', 'constraint' => '255', 'null' => TRUE];
$fields['remember_token'] = ['type' => 'VARCHAR', 'constraint' => '255', 'null' => TRUE];
$fields['last_login'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];
$fields['heartbeat'] = ['type' => 'INT', 'constraint' => '32', 'null' => TRUE];