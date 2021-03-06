Ext.require('Ext.window.MessageBox');
Ext.define('ExtZF.controller.plano.Financeiro', {
    extend: 'Ext.app.Controller',
    stores: ['Financeiro','programacoes.OrcamentoStore'], // Store utilizado no gerenciamento do usuário
    models: ['Financeiro','programacoes.OrcamentoModel'], // Modelo do usuário
     views: [
    'plano.financeiro.List',
    'plano.financeiro.Edit'
    ],
    initiated:false,
    refs: [{
                ref:'grid',
                selector:'planoFinanceiroList'
            },{
                ref:'formPanel',
                selector:'planoFinanceiroEdit'
            }
        ],
    init: function() {
        var me=this;
        this.control(
        {
            'planoFinanceiroList': {
                itemdblclick: this.editObject
            },
            'planoFinanceiroList button[action=incluir]': {
                click: this.editObject
            },
            'planoFinanceiroList button[action=excluir]': {
                click: this.deleteObject
            },
            'planoFinanceiroEdit': {
                afterrender: this.editRender
            },
            'planoFinanceiroEdit combo[ref=cmb_fonte]': {
                select: this.filterByFonte
            },
            'planoFinanceiroEdit combo[ref=cmb_grupo_despesas]': {
                select: this.filterByGrupoDespesas
            },
            'planoFinanceiroEdit button[action=salvar]': {
                click: this.saveObject
            }
        });
        
        me.application.on({
            planoFinanceiroSave: me.save, 
            scope: this
        });
        me.application.on({
            'planoProgramacaoFinanceiro.filterByProgramacao': me.reloadStoreByProgramacao, 
            scope: this
        });
         
        
        me.initiated=true;
    },
    filterByFonte : function(cmb,records){
        var record  =records[0];
        var grupo_despesas = Ext.getCmp('cmb_grupo_despesas');
        grupo_despesas.clearValue();
        grupo_despesas.getStore().remoteFilter=false;
        grupo_despesas.getStore().clearFilter();
        grupo_despesas.getStore().remoteFilter=true;
        grupo_despesas.getStore().filter('programacao_id',record.get('id'));
        var item_despesa =  Ext.getCmp('origem_recurso_id');
        item_despesa.clearValue();
        item_despesa.filter('1','2');
    },
    filterByGrupoDespesas : function(cmb,records){
        var record  =records[0];
        var item_despesa =  Ext.getCmp('origem_recurso_id');
        item_despesa.clearValue();
        item_despesa.getStore().remoteFilter=false;
        item_despesa.getStore().clearFilter();
        item_despesa.getStore().remoteFilter=true;
        item_despesa.getStore().filter('programacao_id',record.get('id'));
    },
    editRender : function(panel, opts){
            var fonte = Ext.getCmp('cmb_fonte');
            var grupo = Ext.getCmp('cmb_grupo_despesas');
            var item = Ext.getCmp('origem_recurso_id');
            var new_store= Etc.cloneStore(item.getStore(),'Fonte');            
            fonte.bindStore(new_store);
            new_store= Etc.cloneStore(item.getStore(),'Grupo');            
            grupo.bindStore(new_store);
    },
    editObject: function(grid, record,obj,x) 
    {
        if(grid.programacao_id===null){
            Ext.MessageBox.show({
			title: 'Salvar'
			,buttons: Ext.MessageBox.OK
			,icon: Ext.MessageBox.ERROR
			,msg: 'Salve a programação antes de incluir ítem de orçamento!'
		});
            return;
        }
        var view = Ext.widget('planoFinanceiroEdit');
        view.setTitle('Edição de orçamento');
        if(!record.data){
            financeiro = {programacao_id : grid.programacao_id };
            record =Ext.ModelMgr.create(financeiro,'ExtZF.model.Financeiro');
            view.setTitle('Cadastro');
        }
      	view.down('form').loadRecord(record);
    },
    showEdit : function(programacao,record)
    {
        console.log("show edit");
        var view = Ext.widget('planoFinanceiroEdit');
        var options = {single: true};
        // Call the controller init method when the view is rendered
        
                
        view.setTitle('Edição ');
        if(!record){
            var opts = {programacao_id : programacao.get('programacao_id'),
                    tipo_registro_id : 1};
                
            record = Ext.ModelMgr.create(opts,'ExtZF.model.Financeiro');
            
        }
        view.down('form').loadRecord(record);
        view.setTitle('Grupo de despesas');
        view.show();
        
    },
    deleteObject: function() {
        var grid = this.getGrid(); // recupera lista de usuários
        var ids = grid.getSelectionModel().getSelection(); // recupera linha selecionadas
        if(ids.length === 0){
        	Ext.Msg.error('Atenção', 'Nenhum registro selecionado');
        	return ;
        }
        Ext.Msg.confirm('Confirmação', 'Tem certeza que deseja excluir o(s) registro(s) selecionado(s)?',
		function(opt){
			if(opt === 'no')
				return;
			grid.el.mask('Excluindo registro(s)');
                        store = this.getFinanceiroStore();
                        store.remove(ids);
                        store.sync();
                        grid.el.unmask();
		}, this);
    },
    save: function(record){
        console.log("salvando orçamento");
        var me = this;
        record.save({
                success: function(a,b){
                    Pcs.info("Salvo com sucesso!");                   
                    me.getFinanceiroStore().load();
                },
                failure:function(a,b){
                    throw{ 
                            name:        "Save error", 
                            level:       "problema ao salvar", 
                            message:     "Erro ao salvar o registro.", 
                            htmlMessage: "Erro ao salvar o registo." 
                        };
                }
            });
    },
    saveObject: function(button) {
        
        var me=this;
        var win    = button.up('window'), // recupera um item acima(pai) do button do tipo window
            form   = win.down('form').getForm(); // recupera item abaixo(filho) da window do tipo form
        if (form.isValid()) {
            r = form.getRecord();
            form.updateRecord(r);
            try{
                me.save(r);
                Ext.Msg.alert('Salvo', 'Registro salvo com sucesso');
                win.close();
            }catch(e){
                Ext.MessageBox.show({
			title: 'Salvar'
			,buttons: Ext.MessageBox.OK
			,icon: Ext.MessageBox.ERROR
			,msg: 'Erro ao salvar o ítem de orçamento!'
                    });
            }
        }
    },
    reloadStoreByProgramacao : function(programacao_id){
        var me = this;
        me.getFinanceiroStore().remoteFilter = false;
        me.getFinanceiroStore().suspendEvents();
        me.getFinanceiroStore().clearFilter();
        me.getFinanceiroStore().resumeEvents();
        me.getFinanceiroStore().remoteFilter = true;
        me.getFinanceiroStore().filter('programacao_id',parseInt(programacao_id,10));
    }
});