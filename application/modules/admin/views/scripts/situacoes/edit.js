Ext.define('ExtZF.view.admin.situacoes.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.adminSituacoesEdit', // nome definido a janela
    title : 'Edição',
    layout: 'fit',
    autoShow: true, // exibir a janela automaticamente ao chamá-la
    initComponent: function() {
    	// Itens da janela
        this.items = [{
            xtype: 'form',
            items: [
	{xtype: 'textfield',name : 'descricao',ref: 'descricao',fieldLabel: 'Descricao'}]}
        ];

        // botões da janela
        this.buttons = [{
            text: 'Salvar',
            action: 'salvar'
        },
        {
            text: 'Cancelar',
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
});