@@ .. @@
   const handleOAuthCallback = async () => {
     // Check if this is an OAuth callback
     const urlParams = new URLSearchParams(window.location.search);
     const fragment = window.location.hash;
     
     if (fragment.includes('access_token') || urlParams.get('code')) {
       console.log('🔗 OAuth callback detected');
       
       try {
         const { data: { session }, error } = await auth.getCurrentSession();
         
         if (error) {
           console.error('❌ OAuth callback error:', error);
           setCurrentPage('auth');
           return;
         }
         
         if (session?.user) {
-          // Check if email is confirmed
-          if (!session.user.email_confirmed_at) {
-            console.log('⚠️ Email not confirmed, redirecting to auth');
-            setCurrentPage('auth');
-            return;
-          }
+          // For Google OAuth, email is automatically confirmed
+          // Only check email confirmation for regular email/password signups
+          const isGoogleUser = session.user.app_metadata?.provider === 'google';
+          
+          if (!isGoogleUser && !session.user.email_confirmed_at) {
+            console.log('⚠️ Email not confirmed, redirecting to auth');
+            setCurrentPage('auth');
+            return;
+          }
           
           // Email is confirmed, handle profile creation
           const { data: profile, error: profileError } = await auth.handleEmailConfirmation(session.user);
           
           if (profileError || !profile) {
             console.error('❌ Profile creation failed:', profileError);
             setCurrentPage('auth');
             return;
           }
           
           const userData = {
             id: profile.id,
             name: profile.name,
             email: profile.email,
             avatar: session.user.user_metadata?.avatar_url,
             tier: profile.tier || 'free'
           };
           
           setUser(userData);
           localStorage.setItem('aiBusinessUser', JSON.stringify(userData));
           setCurrentPage('dashboard');
           
           // Clean up URL
           window.history.replaceState({}, document.title, '/dashboard');
         }
       } catch (error) {
         console.error('❌ OAuth callback processing error:', error);
         setCurrentPage('auth');
       }
     }
   };