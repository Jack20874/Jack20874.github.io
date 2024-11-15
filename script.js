function generateModXML(modName, traits) {
    if (!modName || traits.length === 0) return null;

    return `<?xml version="1.0" encoding="utf-8"?>
<Defs>
    ${traits.map((trait, index) => `
    <TraitDef>
        <defName>${sanitizeXML(modName)}_Trait_${index + 1}</defName>
        <commonality>1</commonality>
        <degreeDatas>
            <li>
                <label>${sanitizeXML(trait.name)}</label>
                <description>${sanitizeXML(trait.description)}</description>
                <degree>0</degree>
                ${trait.stats.map(stat => `
                <statOffsets>
                    <${stat.name}>${parseFloat(stat.value)}</${stat.name}>
                </statOffsets>`).join('')}
                <commonality>1</commonality>
            </li>
        </degreeDatas>
    </TraitDef>`).join('\n')}
</Defs>`;
}

// 预定义的数值标签列表
const statDefinitions = {
    work: {
        label: "工作能力",
        stats: {
            WorkSpeedGlobal: "全局工作速度",
            ResearchSpeed: "研究速度",
            MiningSpeed: "挖掘速度",
            MiningYield: "挖掘产出",
            ConstructionSpeed: "建造速度",
            PlantWorkSpeed: "种植速度",
            PlantHarvestYield: "收获产量",
            AnimalGatherSpeed: "动物采集速度",
            AnimalGatherYield: "动物产品产量",
            CookSpeed: "烹饪速度",
            FoodPoisonChance: "食物中毒几率",
            ButcheryFleshSpeed: "屠宰速度",
            ButcheryFleshEfficiency: "屠宰效率",
            SmithingSpeed: "锻造速度",
            TailoringSpeed: "裁缝速度",
            DrugSynthesisSpeed: "药物合成速度",
            StonecuttingSpeed: "切石速度",
            SmeltingSpeed: "冶炼速度",
            GeneralLaborSpeed: "常规工作速度"
        }
    },
    combat: {
        label: "战斗能",
        stats: {
            ShootingAccuracyPawn: "射击精度",
            AimingDelayFactor: "瞄准时间",
            ReloadSpeed: "装填速度",
            RangedCooldown: "远程冷却",
            MeleeHitChance: "近战命中率",
            MeleeDodgeChance: "近战闪避率",
            MeleeDPS: "近战DPS",
            MeleeWeaponDamageMultiplier: "近战武器伤害",
            ShootingAccuracyTurret: "炮塔精度",
            IncomingDamageFactor: "受伤倍率",
            ArmorRating_Blunt: "钝器护甲",
            ArmorRating_Sharp: "利器护甲",
            ArmorRating_Heat: "热能护甲",
            MoveSpeed: "移动速度"
        }
    },
    basic: {
        label: "基础属性",
        stats: {
            MentalBreakThreshold: "精神崩溃阈值",
            PainShockThreshold: "疼痛休克阈值",
            ImmunityGainSpeed: "免疫获得速度",
            ImmunityGainSpeedFactor: "免疫获得系数",
            HungerRateMultiplier: "饥饿速度",
            RestRateMultiplier: "休息效率",
            GlobalLearningFactor: "全局学习系数",
            EatingSpeed: "进食速度",
            ComfyTemperatureMin: "最低适应温度",
            ComfyTemperatureMax: "最高适应温度",
            Flammability: "易性",
            MeatAmount: "肉类产量",
            LeatherAmount: "皮革产量",
            CarryingCapacity: "携带能力",
            Mass: "重量",
            MarketValue: "市场价值"
        }
    },
    social: {
        label: "社交能力",
        stats: {
            SocialImpact: "社交影响力",
            TradePriceImprovement: "交易价格改善",
            NegotiationAbility: "谈判能力",
            TameAnimalChance: "驯服动物几率",
            TrainAnimalChance: "训练动物几率",
            RecruitPrisonerChance: "招募囚犯几率",
            SocialSkill: "社交技能",
            PawnBeauty: "魅力",
            AnimalGatherYield: "动物产品产量",
            TradePriceFactor: "交易价格系数"
        }
    },
    medical: {
        label: "医疗能力",
        stats: {
            MedicalTendQuality: "医疗照顾质量",
            MedicalTendSpeed: "医疗照顾速度",
            MedicalOperationSpeed: "手术速度",
            MedicalSurgerySuccessChance: "手术成功率",
            HealingFactor: "治疗系数",
            BleedRate: "失血率",
            LifespanFactor: "寿命系",
            ImmunityGainSpeed: "免疫获得速度"
        }
    },
    mental: {
        label: "精神属",
        stats: {
            PsychicSensitivity: "心灵敏感度",
            ToxicSensitivity: "毒素敏感度",
            MentalBreakThreshold: "精神崩溃阈值",
            MoodOffset: "心情偏移",
            OpinionOffset: "观点偏移",
            FearParalysisFactor: "恐惧瘫痪系数",
            AnxietyFactor: "焦虑系数",
            JoyGainFactor: "娱乐获得系数"
        }
    },
    needs: {
        label: "需求相关",
        stats: {
            FoodPoisonChance: "食物中毒几率",
            HungerRate: "饥饿速度",
            RestFallRate: "疲劳速度",
            JoyGainFactor: "娱乐获得系数",
            ComfortGainFactor: "舒适度获得系数",
            NeedsFallFactor: "需求下降系数"
        }
    }
};

// 更新filterStats函数
function filterStats(category) {
    const statsContainer = document.querySelector('.stats');

    // 更新标签激活状态
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        }
    });

    // 清空现有标签
    statsContainer.innerHTML = '';

    if (category === 'all') {
        Object.keys(statDefinitions).forEach(cat => {
            const stats = statDefinitions[cat].stats;
            const categoryHtml = `
                <div class="stat-category">
                    <h6>${statDefinitions[cat].label}</h6>
                    ${generateStatCheckboxes(stats)}
                </div>
            `;
            statsContainer.insertAdjacentHTML('beforeend', categoryHtml);
        });
    } else {
        const stats = statDefinitions[category].stats;
        statsContainer.innerHTML = generateStatCheckboxes(stats);
    }
}

// 更新生成标签选择框的函数
function generateStatCheckboxes(stats) {
    return Object.entries(stats).map(([key, label]) => `
        <div class="stat-item">
            <input type="checkbox" value="${key}" style="width: auto; margin-right: 10px;">
            <label style="flex: 1;">${label}</label>
            <input type="number" class="number-input" placeholder="数值">
        </div>
    `).join('');
}

// 添加事件监听器
document.addEventListener('DOMContentLoaded', function () {
    // 初始化显示所有分类
    filterStats('all');

    // 为分类标签添加点击事件
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            filterStats(tab.dataset.category);
        });
    });
});

// 添加自定义标签
function addCustomStat(button) {
    const container = button.parentElement.previousElementSibling;
    const customName = button.previousElementSibling.value;

    if (!customName) return;

    const statHtml = `
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="${customName}" checked>
            <label class="form-check-label">${customName}</label>
            <input type="number" class="form-control form-control-sm d-inline-block w-25 ms-2" placeholder="数值">
            <select class="form-select form-select-sm d-inline-block w-25 ms-2">
                <option value="percentage">百分比</option>
                <option value="flat">固定值</option>
            </select>
            <button type="button" class="btn btn-danger btn-sm ms-2" onclick="this.parentElement.remove()">删除</button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', statHtml);
    button.previousElementSibling.value = '';
}

// 添加新的特性
function addTrait() {
    const traitHtml = `
        <div class="trait-item">
            <div class="search-box">
                <input type="text" placeholder="特性名称" />
                <textarea placeholder="特性描：{0}是一个性格开朗的人。" rows="3">{0}</textarea>
            </div>
            
            <div class="stats-container">
                <div class="category-tabs">
                    <button class="category-tab active" data-category="all">所有分类</button>
                    <button class="category-tab" data-category="work">工作能力</button>
                    <button class="category-tab" data-category="combat">战斗能力</button>
                    <button class="category-tab" data-category="basic">基础属性</button>
                    <button class="category-tab" data-category="social">社交能力</button>
                    <button class="category-tab" data-category="medical">医疗能力</button>
                    <button class="category-tab" data-category="mental">精神属性</button>
                    <button class="category-tab" data-category="needs">需求相关</button>
                </div>
                <div class="stats"></div>
            </div>
            <button type="button" class="btn btn-danger mt-2" onclick="this.parentElement.remove()">删除特性</button>
        </div>
    `;

    document.getElementById('traits').insertAdjacentHTML('beforeend', traitHtml);

    // 获取新添加的特性元素
    const newTrait = document.getElementById('traits').lastElementChild;

    // 为新添加的特性初始化分类标签点击事件
    newTrait.querySelectorAll('.category-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            // 更新当前特性内的标签激活状态
            newTrait.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 更新当前特性的数值标签列表
            const statsContainer = newTrait.querySelector('.stats');
            if (tab.dataset.category === 'all') {
                statsContainer.innerHTML = '';
                Object.keys(statDefinitions).forEach(cat => {
                    const stats = statDefinitions[cat].stats;
                    const categoryHtml = `
                        <div class="stat-category">
                            <h6>${statDefinitions[cat].label}</h6>
                            ${generateStatCheckboxes(stats)}
                        </div>
                    `;
                    statsContainer.insertAdjacentHTML('beforeend', categoryHtml);
                });
            } else {
                const stats = statDefinitions[tab.dataset.category].stats;
                statsContainer.innerHTML = generateStatCheckboxes(stats);
            }
        });
    });

    // 初始化显示所有分类的数值标签
    const statsContainer = newTrait.querySelector('.stats');
    Object.keys(statDefinitions).forEach(cat => {
        const stats = statDefinitions[cat].stats;
        const categoryHtml = `
            <div class="stat-category">
                <h6>${statDefinitions[cat].label}</h6>
                ${generateStatCheckboxes(stats)}
            </div>
        `;
        statsContainer.insertAdjacentHTML('beforeend', categoryHtml);
    });
}

// 修改下载函数，生成完整的Mod文件夹结构
async function downloadMod(modName, xmlContent) {
    try {
        const zip = new JSZip();

        // 获取作者和描述
        const modAuthor = document.getElementById('modAuthor').value || 'ModMaker';
        const modDescription = document.getElementById('modDescription').value || '这是一个自定义特性Mod。';

        // 创建文件夹
        const aboutFolder = zip.folder("About");
        const defsFolder = zip.folder("Defs");

        // 更新About.xml内容
        const aboutContent = `<?xml version="1.0" encoding="utf-8"?>
<ModMetaData>
    <name>${sanitizeXML(modName)}</name>
    <author>${sanitizeXML(modAuthor)}</author>
    <supportedVersions>
        <li>1.4</li>
        <li>1.5</li>
    </supportedVersions>
    <description>${sanitizeXML(modDescription)}\n\n可用于RimWorld 1.4和1.5版本。</description>
    <packageId>ModMaker.${sanitizeXML(modName)}</packageId>
</ModMetaData>`;

        // 保存文件
        aboutFolder.file("About.xml", aboutContent);
        defsFolder.file("TraitDefs.xml", xmlContent);

        // 生成并下载zip文件
        const content = await zip.generateAsync({ type: "blob" });
        const url = window.URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${modName}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        alert('Mod文件已成功生成！\n此Mod支持RimWorld 1.4和1.5版本\n请解压后放入RimWorld的Mods文件夹中。');
    } catch (error) {
        alert('生成Mod文件时发生错误：' + error.message);
    }
}

// 修改generateMod函数，使用新的下载函数
function generateMod() {
    const modName = document.getElementById('modName').value;
    const modAuthor = document.getElementById('modAuthor').value;
    const modDescription = document.getElementById('modDescription').value;

    if (!modName) {
        alert('请输入Mod名称！');
        return;
    }

    if (!modAuthor) {
        alert('请输入Mod制作人名称！');
        return;
    }

    if (!modDescription) {
        alert('请输入Mod描述！');
        return;
    }

    const traits = [];
    let hasError = false;

    document.querySelectorAll('.trait-item').forEach(item => {
        const traitName = item.querySelector('input[type="text"]').value;
        const description = item.querySelector('textarea').value;

        // 验证描述文本
        if (!description.includes("NAME") && !description.includes("{0}")) {
            // 如果描述中没有包含占位符，自动添加
            const formattedDescription = `{0}是${description}`;
            item.querySelector('textarea').value = formattedDescription;
        }

        const stats = [];

        if (!traitName || !description) {
            alert('请填写完整的特性信息（名称和描述）！');
            hasError = true;
            return;
        }

        // 获取所有选中的数值标签
        item.querySelectorAll('.stat-item input[type="checkbox"]:checked').forEach(checkbox => {
            const container = checkbox.closest('.stat-item');
            const value = container.querySelector('.number-input').value;

            if (!value) {
                alert(`请为 "${checkbox.nextElementSibling.textContent}" 填写数值！`);
                hasError = true;
                return;
            }

            stats.push({
                name: checkbox.value,
                value: value
            });
        });

        if (stats.length === 0) {
            alert('请至少选择一个数值标签并设置数值！');
            hasError = true;
            return;
        }

        traits.push({
            name: traitName,
            description: description,
            stats: stats
        });
    });

    if (hasError) return;
    if (traits.length === 0) {
        alert('请至少添加一个特性！');
        return;
    }

    // 生成XML内容
    const modContent = generateModXML(modName, traits);
    if (modContent) {
        downloadMod(modName, modContent);
    }
}

// XML特殊字符转义函数
function sanitizeXML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// 生成Mod文件
function generateMod() {
    const modName = document.getElementById('modName').value;
    const modAuthor = document.getElementById('modAuthor').value;
    const modDescription = document.getElementById('modDescription').value;

    if (!modName) {
        alert('请输入Mod名称！');
        return;
    }

    if (!modAuthor) {
        alert('请输入Mod制作人名称！');
        return;
    }

    if (!modDescription) {
        alert('请输入Mod描述！');
        return;
    }

    const traits = [];
    let hasError = false;

    document.querySelectorAll('.trait-item').forEach(item => {
        const traitName = item.querySelector('input[type="text"]').value;
        const description = item.querySelector('textarea').value;

        // 验证描述文本
        if (!description.includes("NAME") && !description.includes("{0}")) {
            // 如果描述中没有包含占位符，自动添加
            const formattedDescription = `{0}是${description}`;
            item.querySelector('textarea').value = formattedDescription;
        }

        const stats = [];

        if (!traitName || !description) {
            alert('请填写完整的特性信息（名称和描述）！');
            hasError = true;
            return;
        }

        // 获取所有选中的数值标签
        item.querySelectorAll('.stat-item input[type="checkbox"]:checked').forEach(checkbox => {
            const container = checkbox.closest('.stat-item');
            const value = container.querySelector('.number-input').value;

            if (!value) {
                alert(`请为 "${checkbox.nextElementSibling.textContent}" 填写数值！`);
                hasError = true;
                return;
            }

            stats.push({
                name: checkbox.value,
                value: value
            });
        });

        if (stats.length === 0) {
            alert('请至少选择一个数值标签并设置数值！');
            hasError = true;
            return;
        }

        traits.push({
            name: traitName,
            description: description,
            stats: stats
        });
    });

    if (hasError) return;
    if (traits.length === 0) {
        alert('请至少添加一个特性！');
        return;
    }

    // 生成并下载XML文件
    const modContent = generateModXML(modName, traits);
    if (modContent) {
        downloadMod(modName, modContent);
    }
}

// 修改generateModXML函数，支持不同程度的特性
function generateModXML(modName, traits) {
    if (!modName || traits.length === 0) return null;

    return `<?xml version="1.0" encoding="utf-8"?>
<Defs>
    ${traits.map((trait, index) => `
    <TraitDef>
        <defName>${sanitizeXML(modName)}_Trait_${index + 1}</defName>
        <commonality>1</commonality>
        <degreeDatas>
            <li>
                <label>${sanitizeXML(trait.name)}</label>
                <description>${sanitizeXML(trait.description)}</description>
                <degree>0</degree>
                ${trait.stats.map(stat => `
                <statOffsets>
                    <${stat.name}>${parseFloat(stat.value)}</${stat.name}>
                </statOffsets>`).join('')}
                <commonality>1</commonality>
            </li>
        </degreeDatas>
    </TraitDef>`).join('\n')}
</Defs>`;
}

// 生成XML和下载文件的函数保持不变... 