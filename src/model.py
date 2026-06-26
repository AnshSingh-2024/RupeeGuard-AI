import torch
import torch.nn as nn
import timm

class RupeeGuardFusion(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn = timm.create_model('efficientnet_b4', pretrained=False, num_classes=0)
        self.vit = timm.create_model('vit_base_patch16_384', pretrained=False, num_classes=0)
        self.cnn_proj = nn.Linear(1792, 512)
        self.vit_proj = nn.Linear(768, 512)
        self.attn = nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)
        self.classifier = nn.Sequential(
            nn.Linear(512, 256), nn.ReLU(), nn.Dropout(0.3),
            nn.Linear(256, 128), nn.ReLU(),
            nn.Linear(128, 2)
        )

    def forward(self, x):
        cnn_feat = self.cnn_proj(self.cnn(x)).unsqueeze(1)
        vit_feat = self.vit_proj(self.vit(x)).unsqueeze(1)
        fused, _ = self.attn(cnn_feat, vit_feat, vit_feat)
        fused = fused.squeeze(1)
        return self.classifier(fused)