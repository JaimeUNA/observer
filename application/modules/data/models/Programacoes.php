<?php

class Data_Model_Programacoes
{
    public function getRecursive($id=null){
           $programacoes_table = new Data_Model_DbTable_Programacoes();
           $where = $id?'programacao_id='.$id:"programacao_id is null";
           $programacoes = $programacoes_table->fetchAll($where, 'ordem' );
           $root = array();
           foreach ($programacoes as $value) {
                $usuario    = $value->findParentRow('Data_Model_DbTable_Usuarios');
                $usuario = $usuario?$usuario->toArray():array();
                $setor      = $value->findParentRow('Data_Model_DbTable_Setores');
                $setor = $setor?$setor->toArray():array();
                $instrumento= $value->findParentRow('Data_Model_DbTable_Instrumentos')->toArray();
                $parent     = $value->findParentRow('Data_Model_DbTable_Programacoes');
                $parent = $parent ? $parent->toArray() :array();
                $operativo = $value->findDependentRowset('Data_Model_DbTable_Operativos');
              
                $operativo = count($operativo)>0?$operativo->toArray():array();
                $child = array(
                       'id'             =>$value->id,
                       'menu'           =>$value->menu,
                       'descricao'      =>$value->descricao,
                       'ordem'          =>$value->ordem,
                       'instrumento_id' =>$value->instrumento_id,
                       'programacao_id' =>$value->programacao_id,
                       'setor_id'       =>$value->setor_id,
                       'responsavel_usuario_id'=>$value->responsavel_usuario_id,
                       'supervisor_usuario_id' =>$value->supervisor_usuario_id,
                       'responsavel'    =>$usuario,
                       'setor'          => $setor,
                       'instrumento'    =>$instrumento,
                       'parent'         =>$parent,
                       'operativo'      =>$operativo,
                       'iconCls'=>'x-tree-noicon'
               );
               $children = $this->getRecursive($value->id);
               if(count($children)> 0){
                   $child['expanded']=true;
                   $child['rows']= $children;
               }else{
                   $child['leaf']=true;
               }
               array_push($root, $child);
           }
           return $root;
       }
       public function getAll($where=null,$order='ordem'){
           $programacoes_table = new Data_Model_DbTable_Programacoes();
           
           $programacoes = $programacoes_table->fetchAll($where,$order );
           $objs = array();
           foreach ($programacoes as $value) {
                $usuario    = $value->findParentRow('Data_Model_DbTable_Usuarios');
                $usuario    = $usuario?$usuario->toArray():array();
                $setor      = $value->findParentRow('Data_Model_DbTable_Setores');
                $setor      = $setor?$setor->toArray():array();
                $instrumento= $value->findParentRow('Data_Model_DbTable_Instrumentos')->toArray();
                $parent     = $value->findParentRow('Data_Model_DbTable_Programacoes');
                $parent     = $parent ? $parent->toArray() :array();
                $operativo  = $value->findDependentRowset('Data_Model_DbTable_Operativos');
              
                $operativo = count($operativo)>0?$operativo->toArray():array();
                $child = array(
                       'id'                     =>$value->id,
                       'menu'                   =>$value->menu,
                       'descricao'              =>$value->descricao,
                       'ordem'                  =>$value->ordem,
                       'instrumento_id'         =>$value->instrumento_id,
                       'programacao_id'         =>$value->programacao_id,
                       'setor_id'               =>$value->setor_id,
                       'responsavel_usuario_id' =>$value->responsavel_usuario_id,
                       'supervisor_usuario_id'  =>$value->supervisor_usuario_id,
                       'responsavel'            =>$usuario,
                       'setor'                  => $setor,
                       'instrumento'            =>$instrumento,
                       'parent'                 =>$parent,
                       'operativo'              =>$operativo
               );
               $objs[]=$child;
           }
           return $objs;
       }
    /**
     *
     * @param type $id
     * @param type $withAssociations
     * @return type array
     */
    public function getProgramacao($id,$withAssociations=false){
           $programacoes = new Data_Model_DbTable_Programacoes();
           $where = "id=$id";
           $programacao = $programacoes->fetchRow($where);
           $row = $programacao->toArray();
           $operativo = $programacao->findDependentRowset('Data_Model_DbTable_Operativos');
           if (count($operativo )>0)  {
               $row['operativo'] = $operativo->toArray();
           }
           
           if($withAssociations){
               $usuario    = $programacao->findParentRow('Data_Model_DbTable_Usuarios');
               $usuario = $usuario?$usuario->toArray():array();
               $setor      = $programacao->findParentRow('Data_Model_DbTable_Setores');
               $setor = $setor?$setor->toArray():array();
               $row['responsavel']=$usuario;
               $row['setor'] = $setor;
               $row['instrumento'] = $programacao->findParentRow('Data_Model_DbTable_Instrumentos')->toArray();
               $parent =$programacao->findParentRow('Data_Model_DbTable_Programacoes');
               $row['parent'] = $parent? $parent->toArray():'';
           }
           return $row;
       }

       /**
        *
        * @param type $menu
        * @return type array
        */
       public function searchProgramacao($menu) {
               $dbProgramacoes = new Data_Model_DbTable_Programacoes();
               $programacoes = $dbProgramacoes->getAdapter()->fetchAll(
                            $dbProgramacoes->select()->setIntegrityCheck(false)
                                        ->from(array('p'=>'programacoes'),'p.*')
                                        ->join(array('i'=>'instrumentos'),'p.instrumento_id = i.id',array())
                                        ->where('i.has_operativo = ?',true)
                                        ->where("p.menu like '%$menu%'"));
               $rows = $programacoes;
           return $rows;
           
       }


       
       
       
    /**
     *
     * @param type $programacao_id
     * @return type array
     */
    public function getNode($programacao_id=null,$instrumento_id=null){
           $programacoes_table = new Data_Model_DbTable_Programacoes();
           
           $where =$programacao_id? "programacao_id=$programacao_id":"instrumento_id=$instrumento_id";
           $programacoes = $programacoes_table->fetchAll($where);
           $rows = array();
           foreach ($programacoes as $programacao) {
               $row = $programacao->toArray();
               $row['leaf']= count($programacao->findDependentRowset ('Data_Model_DbTable_Programacoes')) == 0 ;
               $row['parent'] =  $programacao->id;
               $rows[]=$row;
           }
           return $rows;
       }
       
}

