import React from 'react';
import './newDonation.css';

function newDonation() {
    return (
        <form>
            <div className="form-group equipamentos-lista" style={{display: 'none'}}>
                &nbsp;<label><h3>Cadastro de equipamentos</h3></label>
                &nbsp;<label>Equipamentos para doação:</label>
                <div className="equipamento-item">
                    <select id="categoria-equipamento" name="categoria-equipamento" required>
                        <option value="">Selecione a categoria</option>
                        <option value="computador">Computador</option>
                        <option value="smartphone">Teclado</option>
                        <option value="smartphone">Mouse</option>
                        <option value="smartphone">Projetor de Vídeo</option>
                        <option value="impressora">Impressora</option>
                        <option value="notebook">Notebook</option>
                        <option value="monitor">Monitor</option>
                        <option value="tablet">Tablet</option>
                        <option value="smartphone">Smartphone</option>
                    </select>
                    &nbsp;<label>Marca e Modelo:</label>
                    <input type="text" id="marca-modelo" name="marca-modelo" placeholder="Marca e Modelo" required />
                    &nbsp;<label>Quantidade:</label>
                    <input type="number" id="quantidade" name="quantidade" placeholder="Quantidade" min="1" required />
                    &nbsp;<label>Estado de conservação:</label>
                    <select id="estado" name="estado" required>
                        <option value="">Estado de conservação</option>
                        <option value="novo">Novo</option>
                        <option value="excelente">Excelente (usado poucas vezes)</option>
                        <option value="bom">Bom (funciona perfeitamente)</option>
                        <option value="regular">Regular (necessita pequenos reparos)</option>
                    </select>
                    &nbsp;<label>Especificações técnicas (se houver):</label>
                    <input type="text" id="especificacoes" name="especificacoes" placeholder="Especificações técnicas " />
                </div>
            </div>   
        </form>
    );
}

export default newDonation;