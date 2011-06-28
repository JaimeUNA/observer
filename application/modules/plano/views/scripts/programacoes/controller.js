Ext.require('Ext.window.MessageBox');
Ext.define('ExtZF.controller.plano.Programacoes', {
    extend: 'Ext.app.Controller',
    stores: ['programacoes.TreeStore', 'Programacoes' ,'Setores','Usuarios','Instrumentos','Operativos'], // Store utilizado no gerenciamento do usuário
    models: ['programacoes.Model4tree', 'Programacoes' ,'Setores','Usuarios','Instrumentos','Operativos'], // Modelo do usuário
     views: [
    'plano.programacoes.List',
    'plano.programacoes.Treegrid',
    'plano.programacoes.Edit',
    'plano.programacoes.Container',
    'plano.programacoes.Anexos',
    'plano.programacoes.Detalhes',
    'plano.anexos.Edit'
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
        me = this;
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
                itemdblclick    : this.editObject,
                itemclick       : this.changeButtonAction
            },
            
            'planoProgramacoesTreegrid button[action=incluir]': {
                click: this.newObject
            },
            'planoProgramacoesTreegrid > [action=edit]': {
                handler: this.editObj
            },
            'planoProgramacoesTreegrid button[action=newRoot]': {
                click: this.newRoot
            },
            'planoProgramacoesTreegrid button[action=excluir]': {
                click: this.deleteObject
            }
            ,
            'planoProgramacoesAnexos button[action=attach]': {
                click: this.attachFile
            }
        });
        
    },
    
    handlerEdit: function(grid, rowIndex, colIndex) {
        var rec = grid.getStore().getAt(rowIndex);
        alert("Edit " + rec.get('menu'));
    },
    attachFile  : function(){
        var view = Ext.widget('planoAnexosEdit');
        view.setTitle('Anexar arquivo')
    },
    newRoot: function() {
        var grid = this.getTreegrid(); 
        
        var view = Ext.widget('planoProgramacoesEdit');
        view.setTitle('Inserir');
        /**
         * TODO pegar automaticamente o root do instrumento(quando mais de um instrumento)
         */
     
        options={instrumento_id :2};
        
        record = Ext.ModelMgr.create(options,'ExtZF.model.Programacoes');
      	view.down('form').loadRecord(record);
    },
    newObject: function() {
        var grid = this.getTreegrid(); 
        var view = Ext.widget('planoProgramacoesEdit');
        view.setTitle('Inserir');
        parent = grid.getSelectionModel().getSelection()[0]; 
        options ={instrumento_id: ''}
        if( parent!=undefined){
            parent_id  = parent.get('id');
            options.programacao_id = parent_id;
            
            instrumento = this.getInstrumentosStore().findRecord('instrumento_id',parent.get('instrumento_id'));
            options.instrumento_id =instrumento.get('id');
            var operativo = instrumento.get('has_operativo');
            if (operativo) {
                view.criaDetail();
                rr = Ext.ModelMgr.create({},'ExtZF.model.Operativos');
                view.down('#frmDetail').getForm().loadRecord(rr);

            }        
            
        }
        
        record = Ext.ModelMgr.create(options,'ExtZF.model.Programacoes');
      	view.down('form').loadRecord(record);
        
        
    },
    editObject :function(grid, rec) {
        var view = Ext.widget('planoProgramacoesEdit');
        view.setTitle('Edição ');
        //TODO buscar record de um outro store(não tree)
        store =  this.getProgramacoesStore();
        record = store.getById(rec.get('id'));
        

        Ext.log({msg:"Carregando registro para edição",level:'info'});
        view.down('form').loadRecord(record);

        var instrumento = record.get('instrumento');
        if (instrumento.has_operativo) {
            view.criaDetail();
            var operativo = record.get('operativo')[0];
            if (operativo == undefined)
                operativo = {};
            rr = Ext.ModelMgr.create(operativo,'ExtZF.model.Operativos');
            view.down('#frmDetail').getForm().loadRecord(rr);
        }                      
                
        
      	
    },
    deleteObject:function() {
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
                        this.getProgramacoesTreeStoreStore().load();
                        grid.el.unmask();
		}, this);
    },
    saveObject: function(button) 
    {
        Ext.log({msg:'Entrou no save',level:'info'});
        var me=this;
        var win    = button.up('window'), // recupera um item acima(pai) do button do tipo window
            formDefault   = win.down('#frmDefault').getForm(),
            formDetail   = win.down('#frmDetail')
            if (formDetail != null)
                formDetail = formDetail.getForm();
        if (formDefault.isValid()) {
            r = formDefault.getRecord();
            formDefault.updateRecord(r);
            r.save({
                success: function(a,b){
                    Ext.log({msg:"Salvo com sucesso!",level:"info"});
                    /**
                     * TODO selecionar o objeto salvo/cridado
                     */
                    if (formDetail != undefined){
                        rd = formDetail.getRecord();
                        formDetail.updateRecord(rd);
                        rd.set('programacao_id',a.get('id'));
                        rd.save({
                            success: function(c,d){
                               Ext.log({msg:"Salvo com sucesso!",level:"info",dump:c});
                                
                            }
                        })
                    }
                    win.close();
                    me.getProgramacoesTreeStoreStore().load();
                    me.getProgramacoesStore().load();
                    
                },
                failure:function(a,b){
                    Ext.log({msg:"Erro ao salvar!",level:"error"});
                }
        });
            
            
        }
    },
    changeButtonAction: function(view, record, item, index, e, options)
    {
         instrumento = this.getInstrumentosStore().findRecord('instrumento_id',record.get('instrumento_id'));
         button = Ext.ComponentQuery.query('planoProgramacoesTreegrid button[action=incluir]')[0];
         if(instrumento){
             button.show()
             button.setText('Adicionar '+instrumento.get('singular'));
         }else{
             button.hide();
         }
         
        var bookTplMarkup = ['<div class="tplDetail"><b>Descrição: </b>{descricao}<br/></div>'];
        var bookTpl = Ext.create('Ext.XTemplate', bookTplMarkup);
        var detailPanel = Ext.getCmp('detailPanel');
        bookTpl.overwrite(detailPanel.body, record.data);         

        if(record.get('instrumento').has_operativo){
             if(record.get('operativo').length>0){
                 operativo = record.get('operativo')[0];
                 var tpl_operativo = new Ext.XTemplate([
                                '<br/><br/><b>Definições:</b><br/>',
                                '<ul class="tplDetail">',
                                    '<tpl for=".">',
                                        '<li>Peso: {peso}</li>',
                                        '<li>Início: {data_inicio:date("d/m/Y")}</li>',
                                        '<li>Prazo: {data_prazo:date("d/m/Y")}</li>',
                                        '<li>Encerramento: {data_encerramento}</li>',
                                    '</tpl>',
                                '</ul>']);
                 tpl_operativo.append(detailPanel.body, operativo);
             }
        }
    }
});