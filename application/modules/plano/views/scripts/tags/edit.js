Ext.define('ExtZF.view.plano.tags.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.planoTagsEdit', // nome definido a janela
    title : 'Edição',
    layout: 'fit',
    autoShow: true, // exibir a janela automaticamente ao chamá-la
    initComponent: function() {
    	// Itens da janela
        this.items = [{
            xtype: 'form',
            items: [
	{xtype: 'textfield',name : 'tag',ref: 'tag',fieldLabel: 'Tag'},
	{xtype: 'textarea',name : 'descricao',ref: 'descricao',fieldLabel: 'Descricao'},]}
        ];

        // botões da janela
        this.buttons = [{
            text: 'Salvar',
            iconCls: 'icon-save',
            action: 'salvar'
        },
        {
            text: 'Cancelar',
            iconCls: 'icon-cancel',
            scope: this,
            handler: this.close
        }];

        this.callParent(arguments);
    }
});