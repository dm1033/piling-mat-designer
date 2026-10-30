package com.temporaryworksconsulting.pilingmatdesigner;

import android.app.AlertDialog;
import android.os.Build;
import android.os.Bundle;
import android.net.Uri;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.WebView;
import android.webkit.WebSettings;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebResourceError;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.webkit.WebViewAssetLoader;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import java.io.ByteArrayInputStream;

public class MainActivity extends ComponentActivity {
    private static final String START = "https://appassets.androidplatform.net/assets/app/index.html";
    private WebView webView;
    private boolean printing = false;

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        FrameLayout frame = new FrameLayout(this);
        frame.setBackgroundColor(0xff173b38);
        webView = new WebView(this);
        frame.addView(webView, new FrameLayout.LayoutParams(-1, -1));
        setContentView(frame);
        frame.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets safe = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(safe.left, safe.top, safe.right, safe.bottom);
            } else {
                view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            }
            return insets;
        });
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override public void handleOnBackPressed() { goBack(); }
        });
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setJavaScriptCanOpenWindowsAutomatically(false);
        settings.setSupportMultipleWindows(false);
        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
        webView.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse local = loader.shouldInterceptRequest(request.getUrl());
                if (local != null) return local;
                return new WebResourceResponse("text/plain", "UTF-8", 403, "Blocked", null, new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (request.isForMainFrame() && request.hasGesture() && "twcd".equals(uri.getScheme()) && "print".equals(uri.getHost())) {
                    printDraft(); return true;
                }
                return !("https".equals(uri.getScheme()) && "appassets.androidplatform.net".equals(uri.getHost()) && uri.getPath() != null && uri.getPath().startsWith("/assets/app/"));
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) new AlertDialog.Builder(MainActivity.this).setTitle("Unable to open the tool")
                    .setMessage("The bundled app could not load. Retry or close and reopen the app.")
                    .setPositiveButton("Retry", (d, w) -> webView.loadUrl(START)).setNegativeButton("Close", (d,w) -> finish()).show();
            }
        });
        if (state == null || webView.restoreState(state) == null) webView.loadUrl(START);
    }
    private void printDraft() {
        if (printing) return;
        printing = true;
        webView.evaluateJavascript("document.querySelector('.report') !== null", value -> {
            if ("true".equals(value)) {
                PrintManager manager = (PrintManager) getSystemService(PRINT_SERVICE);
                manager.print("Piling Mat — DRAFT", webView.createPrintDocumentAdapter("Piling Mat — DRAFT"), new PrintAttributes.Builder().setMediaSize(PrintAttributes.MediaSize.ISO_A4).build());
            }
            printing = false;
        });
    }
    private void goBack() { if (webView.canGoBack()) webView.goBack(); else new AlertDialog.Builder(this).setTitle("Close Piling Mat Designer?").setMessage("Unsaved inputs will be lost. Saved projects remain on this device.").setPositiveButton("Close", (d,w) -> finish()).setNegativeButton("Keep working", null).show(); }
    @Override protected void onSaveInstanceState(Bundle out) { super.onSaveInstanceState(out); webView.saveState(out); }
    @Override protected void onDestroy() { webView.destroy(); super.onDestroy(); }
}
