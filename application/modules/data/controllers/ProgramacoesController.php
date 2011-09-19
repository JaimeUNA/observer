<?php

class Data_ProgramacoesController extends Zend_Rest_Controller
{

    public function init()
    {
        $swContext = $this->_helper->contextSwitch();
        $swContext->setAutoJsonSerialization(true);
        $swContext->addActionContext('index', array('json', 'xml'))
                        ->addActionContext('put', array( 'json', 'xml'))
                        ->addActionContext('post', array('json', 'xml'))
                        ->addActionContext('get', array('json', 'xml'))
                        ->addActionContext('delete', array( 'json', 'xml'))
                        ->addActionContext('search', array( 'json', 'xml'))
                        ->initContext('json');
        $this->_helper->layout()->disableLayout();
    }

    public function indexAction()
    {
        $this->_auth = Zend_Auth::getInstance ();
        $identity = $this->_auth->getIdentity();
            
        try{
            $programacoes_table = new Data_Model_Programacoes();
            $this->_helper->viewRenderer->setNoRender(true);
            if($this->_getParam('toTree')){
                $node_id = is_numeric($this->_getParam('node'))?$this->_getParam('node'):null;
                $this->view->rows= $programacoes_table->getRecursive($node_id);
            }else if ($this->_hasParam ('query')){
                $this->view->rows = $programacoes_table->searchProgramacao($this->_getParam('query'));
            }elseif($this->_hasParam('filter')){
                $filtro  = json_decode($this->_getParam('filter'),true);
                
                $this->view->rows = $programacoes_table->getFilter($filtro[0]['property']."=".$identity->id);
            }else {
                $this->view->rows = $programacoes_table->getAll();
            }
            $this->view->success= true;
        }catch(Exception $e){
            $this->success=false;
            $this->msg = $e->getMessage();
        }
    }
    

    public function getAction() 
    {
        $programacoes_table = new Data_Model_Programacoes();
        $rows = $programacoes_table->getProgramacao($this->_getParam('id'), true);
        $this->_helper->viewRenderer->setNoRender(true);
        $this->view->success=true;
        $this->view->rows= $rows;
    }
    public function putAction() 
    {
        //TODO retirar os campos que não são da tabela
        //gerado automaticamente
        if(($this->getRequest()->isPut())){
            try{
                $programacoes_table = new Data_Model_DbTable_Programacoes();
                $formData = $this->getRequest()->getParam('rows');
                $formData = json_decode($formData,true);
                $id=$formData['id'];
                unset($formData['id']);
                $programacoes_table->update($formData, "id=$id");
                $this->view->msg = "Dados atualizados com sucesso!";
                $obj = $programacoes_table->fetchRow("id=$id");
                $this->view->rows = $obj->toArray();
                $this->view->success=true;
        
            }  catch (Exception $e){
                $this->view->success=false;
                $this->view->method = $this->getRequest()->getMethod();
                $this->view->msg = "Erro ao atualizar registro<br>".$e->getMessage() ."<br>".$e->getTraceAsString();
            }
        }else{
            $this->view->msg="Método ".$this->getRequest()->getMethod();
        }
    }

    public function postAction() 
    {
        //gerado automaticamente
        if($this->getRequest()->isPost()){
            try{
        
                $programacoes_table = new Data_Model_DbTable_Programacoes();
                $formData = $this->getRequest()->getPost('rows');
                $formData = json_decode($formData,true);
                unset($formData['id']);
                foreach ($formData as $key => $value) {
                    if($value=='')
                       unset($formData[$key]);
                }
                $id = $programacoes_table->insert($formData);
                $this->view->msg="Dados inseridos com sucesso!";
        
                $obj = $programacoes_table->fetchRow("id=$id");
                $this->view->rows = $obj->toArray();
                $this->view->success=true;
                $this->view->metodo = $this->getRequest()->getMethod();
        
            }  catch (Exception $e){
                $this->view->success = false;
                $this->view->method  = $this->getRequest()->getMethod();
                $this->view->msg     = "Erro ao atualizar/inserir registro<br>".$e->getMessage()."<br>".$e->getTraceAsString();
            }
        }else{
            $this->view->msg="Método ".$this->getRequest()->getMethod();
        }
    }

    public function deleteAction() 
    {
        if($this->getRequest()->isDelete()){
            try{
                $programacoes_table = new Data_Model_DbTable_Programacoes();
                $id = $this->_getParam('id');
                $programacoes_table->delete('id='.$id);
                $this->view->success=true;
                $this->view->msg="Dados apagados com sucesso!";
            }  catch (Exception $e){
                $this->view->success=false;
                $this->view->msg = "Erro ao apagar o registro<br>".$e->getTraceAsString();
            }
        }else{
            $this->view->msg="Método delete";
            $this->view->parametros = $this->_getAllParams();
        }
    }


}
