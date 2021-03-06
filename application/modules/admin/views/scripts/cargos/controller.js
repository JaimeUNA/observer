Ext.require('Ext.window.MessageBox');
Ext.define('ExtZF.controller.admin.Cargos', {
    extend: 'Ext.app.Controller',
    stores: ['Cargos'], // Store utilizado no gerenciamento do usuário
    models: ['Cargos'], // Modelo do usuário
     views: [
    'admin.cargos.List',
    'admin.cargos.Edit'
    ],
    refs: [{
                ref:'grid',
                selector:'adminCargosList'
            },{
                ref:'formPanel',
                selector:'adminCargosEdit'
            }
        ],
    init: function() {
        this.control(
        {
            'adminCargosList': {
                itemdblclick: this.editObject
            },
            'adminCargosList button[action=incluir]': {
                click: this.editObject
            },
            'adminCargosList button[action=excluir]': {
                click: this.deleteObject
            },
            'adminCargosEdit button[action=salvar]': {
                click: this.saveObject
            }
        });
    },
    editObject: function(grid, record) {
        var view = Ext.widget('adminCargosEdit');
        view.setTitle('Edição ');
        if(!record.data){
            record = new ExtZF.model.Cargos();
            this.getCargosStore().add(record);
            view.setTitle('Cadastro');
        }
      	view.down('form').loadRecord(record);
    },
    deleteObject: function() {
        var grid = this.getGrid(); // recupera lista de usuários
        ids = grid.getSelectionModel().getSelection(); // recupera linha selecionadas
        if(ids.length === 0){
        	Ext.Msg.alert('Atenção', 'Nenhum registro selecionado');
        	return ;
        }
        Ext.Msg.confirm('Confirmação', 'Tem certeza que deseja excluir o(s) registro(s) selecionado(s)?',
		function(opt){
			if(opt === 'no')
				return;
			grid.el.mask('Excluindo registro(s)');
                        store = this.getCargosStore();
                        store.remove(ids);
                        store.sync();
                        grid.el.unmask();
		}, this);
    },
    saveObject: function(button) {
        var me=this;
        var win    = button.up('window'), // recupera um item acima(pai) do button do tipo window
            form   = win.down('form').getForm() // recupera item abaixo(filho) da window do tipo form
        if (form.isValid()) {
            r = form.getRecord();
            form.updateRecord(r);
            this.getCargosStore().sync();
            win.close();
            this.getCargosStore().load();
        }
    }
});