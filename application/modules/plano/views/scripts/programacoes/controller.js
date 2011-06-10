Ext.require('Ext.window.MessageBox');
Ext.define('ExtZF.controller.plano.Programacoes', {
    extend: 'Ext.app.Controller',
    stores: ['Programacoes','Setores'], // Store utilizado no gerenciamento do usuário
    models: ['Programacoes','Setores'], // Modelo do usuário
     views: [
    'plano.programacoes.List',
    'plano.programacoes.Treegrid',
    'plano.programacoes.Edit'
    ],
    refs: [{
                ref:'treegrid',
                selector:'planoProgramacoesTreegrid'
            },{
                ref:'grid',
                selector:'planoProgramacoesList'
            },{
                ref:'formPanel',
                selector:'planoProgramacoesEdit'
            }
        ],
    init: function() {
        this.control(
        {
            'planoProgramacoesList': {
                itemdblclick: this.editObject
            },
            'planoProgramacoesList button[action=incluir]': {
                click: this.newObject
            },
            'planoProgramacoesList button[action=excluir]': {
                click: this.deleteObject
            },
            'planoProgramacoesEdit button[action=salvar]': {
                click: this.saveObject
            },
            'planoProgramacoesTreegrid': {
                itemdblclick: this.editObject
            },
            'planoProgramacoesTreegrid button[action=incluir]': {
                click: this.newObject
            },
            'planoProgramacoesTreegrid button[action=excluir]': {
                click: this.deleteObject
            }
        });
    },
    newObject: function() {
        var grid = this.getTreegrid(); 
        
        var view = Ext.widget('planoProgramacoesEdit');
        view.setTitle('Inserir');
        
        parent = grid.getSelectionModel().getSelection()[0]; 
        record = new ExtZF.model.Programacoes();
        if(parent!=undefined){
            parent_id = parent.get('id');
            record.set('programacao_id',parent_id);
            //TODO pegar o nivel do instrumento filho
        }
        console.log('ids selecionado');
        //this.getProgramacoesStore().add(record);
        
      	view.down('form').loadRecord(record);
    },
    editObject: function(grid, record) {
        var view = Ext.widget('planoProgramacoesEdit');
        view.setTitle('Edição ');
        if(!record.data){
            record = new ExtZF.model.Programacoes();
            this.getProgramacoesStore().add(record);
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
                        store = this.getProgramacoesStore();
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
            r.save();
            this.getProgramacoesStore().sync();
            win.close();
            this.getProgramacoesStore().load();
        }
    }
});