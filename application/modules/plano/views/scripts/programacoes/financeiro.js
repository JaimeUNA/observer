Ext.define('ExtZF.view.plano.programacoes.Financeiro', {
    extend: 'Ext.window.Window',
    alias : 'widget.planoProgramacoesFinanceiro', // nome definido a janela
    title : 'Edição',
    layout: 'fit',
    width : 340,
    minHeight : 690,
    
    
    autoShow: true, // exibir a janela automaticamente ao chamá-la,
   
    initComponent: function() {
         var frmFinanceiro =  Ext.create('Ext.form.Panel', {
            id: 'frmFinanceiro',
            padding:8,
            bodyPadding: 12,
            items: [
                {
                    xtype: 'combo',
                    id          : 'programacao_id',
                    name        : 'programacao_id',
                    ref         : 'programacao_id',
                    fieldLabel  : 'Ítem do orçamento', 
                    store       : 'Programacoes',
                    displayField: 'menu',
                    valueField  : 'id',
                    anchor      : '95%',
                    hidden      : false,
                    allowBlank  : true,
                    typeAhead   : true,
                    width       : 650,
                    mode        : 'remote',
                    queryParam  : 'getOrcamento',
                    allQuery    : ' '
                },
                {
                    xtype   : 'textfield',
                    name    : 'valor',
                    id      :  'vlr_financeiro',
                    ref     : 'valor',
                    fieldLabel: 'Valor Gasto'
                },
            {
                xtype: 'htmleditor',
                name : 'descricao',
                ref: 'descricao',
                fieldLabel: 'Descrição',
                anchor:'95%'

            },
            {
                xtype: 'hiddenfield',
                name:'programacao_id',
                ref:'programacao_id'
            },

            {
                xtype: 'hiddenfield',
                name:'id',
                ref:'id'
            }
            ]            
            
        });                     

        this.items = [frmFinanceiro];
        // botões da janela
        this.buttons = [
                {
                    text: 'Salvar',
                    action: 'salvar',
                    iconCls: 'icon-save'
                },
                {
                    text: 'Cancelar',
                    scope: this,
                    handler: this.close,
                    iconCls : 'icon-cancel'
                }];

        this.callParent(arguments);
    }
});